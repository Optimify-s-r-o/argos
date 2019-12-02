async function saveSetting(token, setting, value, callback) {
    try {
        const result = await fetch(
            'http://104.248.41.203/api/Configuration/set',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    Name: setting,
                    Value: value,
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