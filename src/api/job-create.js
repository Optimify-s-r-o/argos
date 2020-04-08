import { getDateString } from '../utils/days';

async function jobCreate(
  url,
  token,
  deadline,
  contractStart,
  contractEnd,
  customerIdentification,
  planAutomatically,
  jobJson,
  callback
) {
  deadline = getFormattedDate(deadline);
  contractStart = getFormattedDate(contractStart);
  contractEnd = getFormattedDate(contractEnd);

  try {
    const result = await fetch('http://' + url + '/api/job', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        deadline: deadline,
        contractStart: contractStart,
        contractEnd: contractEnd,
        customerIdentification: customerIdentification,
        planAutomatically: planAutomatically,
        jobJson: jobJson,
      }),
    });
    const data = { status: result.status, body: await result.json() };
    callback(data);
  } catch (e) {
    console.log(e);
  }
}

function getFormattedDate(date) {
  if (date instanceof Date) return getDateString(date);
  else return date;
}

export default jobCreate;
