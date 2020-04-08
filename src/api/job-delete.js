async function jobDelete(url, token, jobId, callback) {
  try {
    const result = await fetch('http://' + url + '/api/job/' + jobId, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = { status: result.status };
    callback(data);
  } catch (e) {
    console.log(e);
  }
}

export default jobDelete;
