function getJob(jobId, callback) {
    fetch(
        'http://localhost:6969/jobs/getJob?jobIdentification=' + jobId,
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

export default getJob;