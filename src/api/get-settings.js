async function getSettings(url, token, callback) {
    try {
        const result = await fetch(
            'http://' + url + '/api/configuration',
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