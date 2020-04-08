async function accountGetToken(url, callback) {
  try {
    const result = await fetch('http://' + url + '/api/account/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        username: 'Admin',
        password: 'Qwertyuiop1_',
      }),
    });
    const data = { status: result.status, body: await result.json() };
    callback(data);
  } catch (e) {
    console.log(e);
  }
}

export default accountGetToken;
