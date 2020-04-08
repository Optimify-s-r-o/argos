async function setDatabasePath(path) {
  try {
    await fetch(
      'http://localhost:6969/configurations/setDatabasePath?path=' + path,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      }
    );
  } catch (e) {
    console.log(e);
  }
}

export default setDatabasePath;
