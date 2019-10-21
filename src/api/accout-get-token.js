async function accountGetToken(callback) {
    try {
        const result = await fetch(
            'http://104.248.41.203/api/Account/getToken',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    username: 'Admin',
                    password: 'Qwertyuiop1_',
                }),
            }
        );
        const data = {status: result.status, body: (await result.json())};
        callback(data);
    } catch(e) {
        console.log(e);
    }
}

export default accountGetToken;