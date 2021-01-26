import { CallbackType } from '../../types/api';

const getShifts = async (
  url: string,
  token: string,
  phase: string,
  callback: CallbackType
) => {
  try {
    const result = await fetch(url + '/api/v1/' + phase + 'shifts', {
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

export default getShifts;
