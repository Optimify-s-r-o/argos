import { CallbackType } from '../../types/api';
import { JobSort } from '../../types/job';

const jobsGet = async (
  url: string,
  token: string,
  callback?: CallbackType,
  page?: number | null,
  pageSize?: number | null,
  sort?: JobSort | null,
  filter?: string | null
) => {
  try {
    let requestString = url + '/api/v1/jobs?';
    requestString += page ? 'page=' + page + '&' : '';
    requestString += pageSize ? 'pageSize=' + pageSize + '&' : '';
    // TODO sort
    // TODO filter
    requestString = requestString.slice(0, -1);

    const result = await fetch(requestString, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
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

export default jobsGet;
