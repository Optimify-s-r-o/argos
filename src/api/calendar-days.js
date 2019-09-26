function getCalendarDays(token, from, to, callback) {
    fetch(
        'http://104.248.41.203/api/Calendar/days?from=' + from + '&to=' + to,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
        }
    )
        .then(res => res.json().then(data => ({status: res.status, body: data})))
        .then(res => {
            callback(res);
        })
        .catch(console.log);
}

export default getCalendarDays;