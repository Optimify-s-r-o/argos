import { CallbackType } from '../../types/api';

const getCalendarDays = async (
  url: string,
  token: string,
  from: string,
  to: string,
  callback: CallbackType
) => {
  try {
    const result = await fetch(
      url + '/api/v1/calendar/overview/full?from=' + from + '&to=' + to,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + token,
        },
      }
    );
    const data = { status: result.status, body: await result.json() };
    callback(data);
  } catch (e) {
    console.log(e);
  }
};

export default getCalendarDays;
