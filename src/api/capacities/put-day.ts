import { CallbackType } from '../../types/api';

const putCapacityForDay = async (
  token: string,
  day: string,
  phase: 'saw' | 'press',
  shiftsData: Array<{ id: string; planned: number; real: number }>,
  callback: CallbackType
) => {
  try {
    const result = await fetch(
      process.env.REACT_APP_BACKEND_API +
        '/api/v1/capacities/' +
        day +
        '/' +
        phase,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ shifts: shiftsData }),
      }
    );
    const data = { status: result.status, body: await result.json() };
    callback && callback(data);
  } catch (e) {
    console.log(e);
  }
};

export default putCapacityForDay;
