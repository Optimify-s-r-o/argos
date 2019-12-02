async function jobDelete(token, jobId, callback) {
    try {
        const result = await fetch(
            'http://104.248.41.203/api/Job/delete?id=' + jobId,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }
        );
        const data = {status: result.status};
        callback(data);
    } catch (e) {
        console.log(e);
    }
}

export default jobDelete;