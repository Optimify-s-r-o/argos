import { CallbackType } from '../../types/api';

const phasePartCreate = async (
  url: string,
  token: string,
  jobGuid: string,
  phase: string,
  date: string,
  callback: CallbackType
) => {
  let endpoint = '/api/v1/' + phase + 'workingphase';

  if (phase !== 'transport') endpoint += '/emptypart';

  let body = {
    jobId: jobGuid,
    day: date,
  };

  try {
    const result = await fetch(url + endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const data = { status: result.status, body: await result.json() };
    if (callback) callback(data);
  } catch (e) {
    console.log(e);
  }
};

export default phasePartCreate;
