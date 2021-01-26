import { CallbackType } from '../../types/api';

const deleteShift = async (
  url: string,
  token: string,
  phase: string,
  id: string,
  callback: CallbackType
) => {
  try {
    const result = await fetch(url + '/api/v1/' + phase + 'shifts/' + id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = { status: result.status, body: await result.json() };
    callback(data);
  } catch (e) {
    console.log(e);
  }
};

export default deleteShift;
