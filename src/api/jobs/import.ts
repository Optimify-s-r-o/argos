import { CallbackType } from '../../types/api';
import { LoadedJobType } from '../../types/job';

const jobCreate = async (
  url: string,
  token: string,
  jobJson: LoadedJobType,
  callback: CallbackType
) => {
  try {
    const result = await fetch(url + '/api/v1/jobs/import', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(jobJson),
    });
    const data = { status: result.status, body: await result.json() };
    callback(data);
  } catch (e) {
    console.log(e);
  }
};

export default jobCreate;
