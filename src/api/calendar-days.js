async function getCalendarDays(url, token, from, to, callback) {
  try {
    const result = await fetch(
      'http://' + url + '/api/calendar/' + from + '/' + to + '/days',
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + token,
        },
      }
    );
    const data = { status: result.status, body: await result.json() };
    callback(data);
  } catch (e) {
    console.log(e);
  }
}

export default getCalendarDays;
