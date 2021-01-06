import { CallbackType } from '../types/api';
import { getDateString } from '../utils/days';
import { LoadedJobType } from '../types/job';

const jobCreate = async (
  url: string,
  token: string,
  deadline: Date,
  contractStart: Date,
  contractEnd: Date,
  customerIdentification: string,
  planAutomatically: boolean,
  jobJson: LoadedJobType,
  callback: CallbackType
) => {
  deadline = getFormattedDate(deadline);
  contractStart = getFormattedDate(contractStart);
  contractEnd = getFormattedDate(contractEnd);

  try {
    const result = await fetch('https://' + url + '/api/v1/jobs/import', {
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
};

function getFormattedDate(date) {
  if (date instanceof Date) return getDateString(date);
  else return date;
}

export default jobCreate;
