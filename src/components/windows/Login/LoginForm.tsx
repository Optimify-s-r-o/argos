import Input from '../../forms/Input';
import styled from 'styled-components';
import Submit from '../../forms/Submit';
import userAuth from '../../../api/users/auth';
import { closeCurrentElectronWindow } from '../../../utils/electron';
import { MainPathWithParams, MainSettings } from '../Main';
import { openWindow } from '../../OpenWindow';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const FIELD_EMAIL = "email";
const FIELD_PASSWORD = "password";

const ERROR_EMPTY_EMAIL = "emptyEmail";
const ERROR_EMPTY_PASSWORD = "emptyPassword";
const ERROR_INVALID_CREDENTIALS = "invalidCredentials";
const ERROR_SERVICE_UNAVAILABLE = "serviceUnavailable";
type ErrorType =
	| "emptyEmail"
	| "emptyPassword"
	| "invalidCredentials"
	| "serviceUnavailable";

const LoginForm = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState<Array<ErrorType>>([]);
	const [isLoading, setLoading] = useState(false);
	const { t } = useTranslation();

	return (
		<>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					setLoading(true);
					setErrors([]);
					userAuth(email, password, (data) => {
						setLoading(false);
						if (data.status === 200) {
							openWindow(
								MainPathWithParams(data.body.token),
								MainSettings,
								(w) => {
									closeCurrentElectronWindow();
								}
							);
						} else if (data.status === 400) {
							const newErrors: Array<ErrorType> = [];
							if (data.body.errors.hasOwnProperty("Email"))
								newErrors.push(ERROR_EMPTY_EMAIL);
							if (data.body.errors.hasOwnProperty("Password"))
								newErrors.push(ERROR_EMPTY_PASSWORD);
							setErrors(newErrors);
						} else if (data.status === 422) {
							setErrors([ERROR_INVALID_CREDENTIALS]);
						} else if (data.status === 503) {
							setErrors([ERROR_SERVICE_UNAVAILABLE]);
						}
					});
				}}
			>
				<LoginHeader>{t("login:header")}</LoginHeader>
				<LoginFormItem>
					<label htmlFor={FIELD_EMAIL}>{t("login:fields.email")}</label>
					<Input
						type="email"
						id={FIELD_EMAIL}
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						hasError={errors.includes(ERROR_EMPTY_EMAIL)}
					/>
					<ErrorBox>
						{errors.includes(ERROR_EMPTY_EMAIL) &&
							t("login:errors." + ERROR_EMPTY_EMAIL)}
					</ErrorBox>
				</LoginFormItem>
				<LoginFormItem>
					<label htmlFor={FIELD_PASSWORD}>{t("login:fields.password")}</label>
					<Input
						type="password"
						id={FIELD_PASSWORD}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						hasError={errors.includes(ERROR_EMPTY_PASSWORD)}
					/>
					<ErrorBox>
						{errors.includes(ERROR_EMPTY_PASSWORD) &&
							t("login:errors." + ERROR_EMPTY_PASSWORD)}
						{errors.includes(ERROR_INVALID_CREDENTIALS) && (
							<Center>{t("login:errors." + ERROR_INVALID_CREDENTIALS)}</Center>
						)}
						{errors.includes(ERROR_SERVICE_UNAVAILABLE) && (
							<Center>{t("login:errors." + ERROR_SERVICE_UNAVAILABLE)}</Center>
						)}
					</ErrorBox>
				</LoginFormItem>
				<LoginFormItem>
					<Submit isLoading={isLoading}>{t("login:fields.login")}</Submit>
				</LoginFormItem>
			</form>
		</>
	);
};

export default LoginForm;

const LoginFormItem = styled.div`
	display: flex;
	flex-direction: column;
	align-items: stretch;

	margin-bottom: 0.5rem;

	label {
		margin-left: 1.5rem;

		font-weight: 400;
	}

	input,
	button {
		margin: 0.5rem 0;
	}

	button {
		align-self: center;
	}
`;

const LoginHeader = styled.h1`
	margin: 0 0 2rem 1.5rem;

	font-size: 2.5rem;
	font-weight: 300;
`;

const ErrorBox = styled.div`
	height: 1.5rem;
	line-height: 1.5rem;

	padding: 0 1.5rem;

	color: ${(props) => props.theme.colors.danger};
	font-size: 0.85rem;
	font-weight: 400;
`;

const Center = styled.div`
	text-align: center;
`;
