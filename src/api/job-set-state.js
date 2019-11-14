const JOB_STATE_CREATED = 'Created';
const JOB_STATE_VERIFIED = 'Verified';
const JOB_STATE_FINISHED = 'Finished';
const JOB_STATE_IN_ARCHIVE = 'InArchive';

const JOB_STATES = [
    JOB_STATE_CREATED,
    JOB_STATE_VERIFIED,
    JOB_STATE_FINISHED,
    JOB_STATE_IN_ARCHIVE,
];

async function jobSetState(token, jobId, state, callback) {
    try {
        const result = await fetch(
            'http://104.248.41.203/api/Job/setState',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    Id: jobId,
                    State: state
                }),
            }
        );
        const data = {status: result.status};
        callback(data);
    } catch (e) {
        console.log(e);
    }
}

function getNextState(state) {
    switch (state) {
        case JOB_STATE_CREATED:
            return JOB_STATE_VERIFIED;

        case JOB_STATE_VERIFIED:
            return JOB_STATE_FINISHED;

        case JOB_STATE_FINISHED:
            return JOB_STATE_IN_ARCHIVE;

        default:
            throw new Error('Invalid job state ' + state + '.')
    }
}

export {jobSetState, getNextState, JOB_STATE_CREATED, JOB_STATE_VERIFIED, JOB_STATE_FINISHED, JOB_STATE_IN_ARCHIVE, JOB_STATES};