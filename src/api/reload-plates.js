async function reloadPlates(token, plates, callback) {
    try {
        const result = await fetch(
            'http://104.248.41.203/api/Plate/reload',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(plates),
            }
        );
        const data = {status: result.status, body: (await result.json())};
        callback(data);
    } catch (e) {
        console.log(e);
    }
}

export default reloadPlates;