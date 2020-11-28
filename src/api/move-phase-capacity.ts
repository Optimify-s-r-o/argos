import { CapacityMoveMethod } from '../types/capacity';
import { StatusCallbackType } from '../types/api';
import {
  METHOD_CAPACITY_ALL,
  METHOD_CAPACITY_FILL,
} from '../components/windows/MoveCapacity';

const movePhaseCapacity = async (
  url: string,
  token: string,
  phase: string,
  method: CapacityMoveMethod,
  phaseId: string,
  toDate: string,
  capacity: number = 0,
  callback: StatusCallbackType
) => {
  let endpoint = '/api/' + phase + 'workingphasepart/';
  let body = {
    id: phaseId,
    date: toDate,
  };

  switch (method) {
    case METHOD_CAPACITY_ALL:
      endpoint += 'capacity/move';
      break;

    case METHOD_CAPACITY_FILL:
      endpoint += 'capacity/fill';
      break;

    default:
      if (phase === 'transport') {
        endpoint += 'move';
      } else {
        endpoint += 'capacity/update';
        body['capacity'] = capacity;
      }
  }

  try {
    const result = await fetch('http://' + url + endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const data = { status: result.status };
    if (callback) callback(data);
  } catch (e) {
    console.log(e);
  }
};

export default movePhaseCapacity;