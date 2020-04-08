async function getJobList(callback) {
  try {
    const result = await fetch('http://localhost:6969/jobs/jobList', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });
    const data = { status: result.status, body: await result.json() };
    callback(data);
  } catch (e) {
    console.log(e);
  }
}

export default getJobList;
