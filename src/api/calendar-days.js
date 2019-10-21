async function getCalendarDays(token, from, to, callback) {
    try {
        const result = await fetch(
            'http://104.248.41.203/api/Calendar/days?from=' + from + '&to=' + to,
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

export default getCalendarDays;