import {getDateString} from '../utils/days';

function jobCreate(token, deadline, contractStart, contractEnd, customerIdentification, planAutomatically, jobJson, callback) {
    deadline = getFormattedDate(deadline);
    contractStart = getFormattedDate(contractStart);
    contractEnd = getFormattedDate(contractEnd);

    fetch(
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
    )
        .then(res => res.json().then(data => ({status: res.status, body: data})))
        .then(res => {
            callback(res);
        })
        .catch(console.log);
}

function getFormattedDate(date) {
    if (date instanceof Date)
        return getDateString(date);
    else
        return date;
}

export default jobCreate;