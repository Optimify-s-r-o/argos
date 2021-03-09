import { CallbackType } from '../../types/api';
import { SortOptions } from '../../components/table';
import { TransportSort } from '../../types/transport';

const getTransports = async (
  url: string,
  token: string,
  callback: CallbackType,
  page?: number | null,
  pageSize?: number | null,
  sort?: TransportSort | null,
  filter?: string | null
) => {
  try {
    let requestString = url + '/api/v1/transports?';
    requestString += page ? 'page=' + page + '&' : '';
    requestString += pageSize ? 'pageSize=' + pageSize + '&' : '';

    if (sort) {
      requestString += 'sort=';
      sort.forEach((sortParam) => {
        requestString += sortParam.column;

        if (sortParam.direction !== SortOptions.Default)
          requestString +=
            '+' + (sortParam.direction === SortOptions.Desc ? 'desc' : 'asc');

        requestString += ',';
      });
      requestString = requestString.slice(0, -1);
      requestString += '&';
    }

    // TODO filter
    requestString = requestString.slice(0, -1);

    const result = await fetch(requestString, {
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

export default getTransports;
