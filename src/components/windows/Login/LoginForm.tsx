import Input from '../../forms/Input';
import React, { useState } from 'react';
import styled from 'styled-components';
import Submit from '../../forms/Submit';
import userAuth from '../../../api/users/auth';
import { closeCurrentElectronWindow } from '../../../utils/electron';
import { MainPathWithParams, MainSettings } from '../Main';
import { openWindow } from '../../OpenWindow';
import { useStore } from 'react-redux';

const FIELD_EMAIL = 'email';
const FIELD_PASSWORD = 'password';

const ERROR_EMPTY_EMAIL = 'errorEmptyEmail';
const ERROR_EMPTY_PASSWORD = 'errorEmptyPassword';
const ERROR_INVALID_CREDENTIALS = 'errorInvalidCredentials';
const ERROR_SERVICE_UNAVAILABLE = 'errorServiceUnavailable';
type ErrorType =
  | 'errorEmptyEmail'
  | 'errorEmptyPassword'
  | 'errorInvalidCredentials'
  | 'errorServiceUnavailable';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Array<ErrorType>>([]);
  const [isLoading, setLoading] = useState(false);
  const state = useStore().getState();

  return (
    <>
      <LoginHeader>Přihlášení</LoginHeader>
      <LoginFormItem>
        <label htmlFor={FIELD_EMAIL}>Email</label>
        <Input
          type='email'
          id={FIELD_EMAIL}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          hasError={errors.includes(ERROR_EMPTY_EMAIL)}
        />
        <ErrorBox>
          {errors.includes(ERROR_EMPTY_EMAIL) && 'Email nesmí být prázdný'}
        </ErrorBox>
      </LoginFormItem>
      <LoginFormItem>
        <label htmlFor={FIELD_PASSWORD}>Heslo</label>
        <Input
          type='password'
          id={FIELD_PASSWORD}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          hasError={errors.includes(ERROR_EMPTY_PASSWORD)}
        />
        <ErrorBox>
          {errors.includes(ERROR_EMPTY_PASSWORD) && 'Heslo nesmí být prázdné'}
        </ErrorBox>
      </LoginFormItem>
      <LoginFormItem>
        <ErrorBoxCenter>
          {errors.includes(ERROR_INVALID_CREDENTIALS) &&
            'Nesprávná kombinace emailu a hesla'}
          {errors.includes(ERROR_SERVICE_UNAVAILABLE) && 'Server není dostupný'}
        </ErrorBoxCenter>
        <Submit
          isLoading={isLoading}
          onClick={() => {
            setLoading(true);
            userAuth(email, password, state.settings.url, (data) => {
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
                if (data.body.errors.hasOwnProperty('Email'))
                  newErrors.push(ERROR_EMPTY_EMAIL);
                if (data.body.errors.hasOwnProperty('Password'))
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
          Přihlásit se
        </Submit>
      </LoginFormItem>
    </>
  );
};

export default LoginForm;

const LoginFormItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;

  margin-bottom: 1.5rem;

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
  padding: 0 1.5rem;

  color: ${(props) => props.theme.colors.danger};
  font-size: 0.85rem;
  font-weight: 400;
`;

const ErrorBoxCenter = styled(ErrorBox)`
  margin-bottom: 0.5rem;

  text-align: center;
`;
