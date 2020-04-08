const ACTION_APP_ACCOUNT_TOKEN_SET = 'APP_ACCOUNT_TOKEN_SET';
const ACTION_SET_PAMBA_PATH = 'SET_PAMBA_PATH';

function appAccountTokenSet(token) {
  return {
    type: ACTION_APP_ACCOUNT_TOKEN_SET,
    token: token,
  };
}

function setPambaPath(path) {
  return {
    type: ACTION_SET_PAMBA_PATH,
    path: path,
  };
}

export {
  ACTION_APP_ACCOUNT_TOKEN_SET,
  ACTION_SET_PAMBA_PATH,
  appAccountTokenSet,
  setPambaPath,
};
