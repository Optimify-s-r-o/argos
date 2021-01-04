import { CallbackType } from '../../types/api';

const getPlates = async (callback: CallbackType) => {
  try {
    const result = await fetch('https://localhost:44394/api/v1/plates', {
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
};

export default getPlates;
