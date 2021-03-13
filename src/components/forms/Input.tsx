import styled from 'styled-components';
import { getColorWithOpacity } from '../../styles/theme';
import { InputHTMLAttributes } from 'react';

interface InputProps {
	hasError?: boolean;
}

const Input = (props: InputHTMLAttributes<HTMLInputElement> & InputProps) => {
	return <StyledInput {...props} />;
};

export default Input;

const StyledInput = styled.input`
	margin: 0.5rem 1rem;
	padding: 0.75rem 1.5rem;

	border: 0;
	border-radius: 999px;
	box-shadow: 0 5px 10px -5px ${(props) =>
			getColorWithOpacity(props.theme.colors.primary, 25)} ${(props) => (props.hasError ? ", inset 0 0 0 1px " + props.theme.colors.danger : "")};
	font-family: "Segoe UI";

	transition: box-shadow 0.2s ease-out;

	&:focus {
		box-shadow: 0 5px 25px -10px ${(props) =>
				getColorWithOpacity(props.theme.colors.accent, 50)} ${(props) => (props.hasError ? ", inset 0 0 0 1px " + props.theme.colors.danger : "")};

		outline: 0;
	}
`;
