import { CallbackType } from '../../types/api';

const getJobList = async (callback: CallbackType) => {
  try {
    const result = await fetch('https://localhost:44394/api/v1/jobs/list', {
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

export default getJobList;
