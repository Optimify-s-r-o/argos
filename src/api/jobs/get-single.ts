import { CallbackType } from '../../types/api';

const getJob = async (
  url: string,
  token: string,
  jobGuid: string,
  callback: CallbackType
) => {
  try {
    const result = await fetch(url + '/api/v1/jobs/' + jobGuid, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = { status: result.status, body: await result.json() };
    callback && callback(data);
  } catch (e) {
    console.log(e);
  }
};

export default getJob;
