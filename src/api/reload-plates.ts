import { CallbackType } from '../types/api';

const reloadPlates = async (
  url: string,
  token: string,
  plates: any,
  callback: CallbackType
) => {
  try {
    const result = await fetch('http://' + url + '/api/plate/reload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(plates),
    });
    const data = { status: result.status, body: await result.json() };
    callback(data);
  } catch (e) {
    console.log(e);
  }
};

export default reloadPlates;