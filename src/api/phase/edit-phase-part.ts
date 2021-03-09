import { CallbackType } from '../../types/api';

export interface ShiftCapacityType {
  shiftGuid: string;
  capacity: number;
}

const phasePartEdit = async (
  url: string,
  token: string,
  partGuid: string,
  shifts: Array<ShiftCapacityType>,
  phase: string,
  callback: CallbackType
) => {
  let endpoint = '/api/v1/' + phase + 'workingphase/' + partGuid;

  let shiftsBody: Array<object> = [];
  shifts.forEach((shift) =>
    shiftsBody.push({
      planned: shift.capacity,
      real: 0,
      shiftId: shift.shiftGuid,
    })
  );

  let body = {
    shifts: shiftsBody,
  };

  try {
    const result = await fetch(url + endpoint, {
      method: 'PUT',
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

export default phasePartEdit;
