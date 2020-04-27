export const ACTION_APP_ACCOUNT_TOKEN_SET = 'APP_ACCOUNT_TOKEN_SET';
export const ACTION_SET_PAMBA_PATH = 'SET_PAMBA_PATH';

export const appAccountTokenSet = (token: string) => {
  return {
    type: ACTION_APP_ACCOUNT_TOKEN_SET,
    token: token,
  };
};

export const setPambaPath = (path: string) => {
  return {
    type: ACTION_SET_PAMBA_PATH,
    path: path,
  };
};
