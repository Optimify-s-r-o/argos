async function getSettings(token, callback) {
    try {
        const result = await fetch(
            'http://104.248.41.203/api/Configuration/getAll',
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
            }
        );
        const data = {status: result.status, body: (await result.json())};
        callback(data);
    } catch (e) {
        console.log(e);
    }
}

export default getSettings;