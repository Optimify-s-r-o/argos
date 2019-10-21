async function getJob(jobId, callback) {
    try {
        const result = await fetch(
            'http://localhost:6969/jobs/getJob?jobIdentification=' + jobId,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            }
        );
        const data = {status: result.status, body: (await result.json())};
        callback(data);
    } catch (e) {
        console.log(e);
    }
}

export default getJob;