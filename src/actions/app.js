const ACTION_APP_ACCOUNT_TOKEN_SET = 'APP_ACCOUNT_TOKEN_SET';

function appAccountTokenSet(token) {
    return {
        type: ACTION_APP_ACCOUNT_TOKEN_SET,
        token: token,
    }
}

export {ACTION_APP_ACCOUNT_TOKEN_SET, appAccountTokenSet};