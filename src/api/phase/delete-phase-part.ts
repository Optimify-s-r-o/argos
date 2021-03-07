import { StatusCallbackType } from '../../types/api';

const phasePartDelete = async (
  url: string,
  token: string,
  phase: string,
  phasePartId: number,
  callback?: StatusCallbackType
) => {
  try {
    const result = await fetch(
      url + '/api/v1/' + phase + 'workingphase/' + phasePartId,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = { status: result.status };
    callback && callback(data);
  } catch (e) {
    console.log(e);
  }
};

export default phasePartDelete;
