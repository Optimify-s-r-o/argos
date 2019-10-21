import {getDateString} from '../utils/days';

async function jobCreate(token, deadline, contractStart, contractEnd, customerIdentification, planAutomatically, jobJson, callback) {
    deadline = getFormattedDate(deadline);
    contractStart = getFormattedDate(contractStart);
    contractEnd = getFormattedDate(contractEnd);

    try {
        const result = await fetch(
            'http://104.248.41.203/api/Job/create',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    Deadline: deadline,
                    ContractStart: contractStart,
                    ContractEnd: contractEnd,
                    CustomerIdentification: customerIdentification,
                    PlanAutomatically: planAutomatically,
                    JobJson: jobJson,
                }),
            }
        );
        const data = {status: result.status, body: (await result.json())};
        callback(data);
    } catch (e) {
        console.log(e);
    }
}

function getFormattedDate(date) {
    if (date instanceof Date)
        return getDateString(date);
    else
        return date;
}

export default jobCreate;