import { CallbackType } from '../types/api';

const getSettings = async (
  url: string,
  token: string,
  callback: CallbackType
) => {
  try {
    const result = await fetch('http://' + url + '/api/configuration', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
    });
    const data = { status: result.status, body: await result.json() };
    callback(data);
  } catch (e) {
    console.log(e);
  }
};

export default getSettings;
