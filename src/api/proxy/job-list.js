function getJobList(callback) {
    fetch(
        'http://localhost:6969/jobs/jobList',
        {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        }
    )
        .then(res => res.json().then(data => ({status: res.status, body: data})))
        .then(res => {
            callback(res);
        })
        .catch(console.log);
}

export default getJobList;