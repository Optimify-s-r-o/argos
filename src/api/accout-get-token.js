function accountGetToken(callback) {
    fetch(
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
    )
        .then(res => res.json().then(data => ({status: res.status, body: data})))
        .then(res => {
            callback(res);
        })
        .catch(console.log);
}

export default accountGetToken;