import { CallbackType } from '../../types/api';

const getJob = async (jobId: string, callback: CallbackType) => {
  try {
    const result = await fetch('http://localhost:65432/api/v1/jobs/' + jobId, {
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

export default getJob;
