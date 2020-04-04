async function saveSetting(url, token, setting, value, callback) {
    try {
        const result = await fetch(
            'http://' + url + '/api/configuration/update',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: setting,
                    value: value,
                }),
            }
        );
        const data = {status: result.status};
        callback(data);
    } catch (e) {
        console.log(e);
    }
}

export default saveSetting;