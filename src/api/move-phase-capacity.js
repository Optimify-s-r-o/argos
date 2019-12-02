import {METHOD_CAPACITY_ALL, METHOD_CAPACITY_FILL} from '../components/windows/MoveCapacity';

async function movePhaseCapacity(token, phase, method, phaseId, toDate, capacity = 0, callback = null) {
    let endpoint = '/api/' + phase + 'WorkingPhasePart/';
    let body = {
        Id: phaseId,
        Date: toDate
    };

    switch (method) {
        case METHOD_CAPACITY_ALL:
            endpoint += 'moveAllCapacity';
            break;

        case METHOD_CAPACITY_FILL:
            endpoint += 'moveCapacityToFill';
            break;

        default:
            if (phase === 'Transport') {
                endpoint += 'move';
            } else {
                endpoint += 'moveCapacity';
                body['Capacity'] = capacity;
            }
    }

    try {
        const result = await fetch(
            'http://104.248.41.203' + endpoint,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            }
        );
        const data = {status: result.status};
        if (callback)
            callback(data);
    } catch (e) {
        console.log(e);
    }
}

export default movePhaseCapacity;