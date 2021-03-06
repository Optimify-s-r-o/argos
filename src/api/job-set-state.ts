import { StatusCallbackType } from '../types/api';

const JOB_STATE_QUOTATION = "Quotation";
const JOB_STATE_VERIFIED = "Verified";
const JOB_STATE_FINISHED = "Finished";
const JOB_STATE_IN_ARCHIVE = "InArchive";

const JOB_STATES = [
	JOB_STATE_QUOTATION,
	JOB_STATE_VERIFIED,
	JOB_STATE_FINISHED,
	JOB_STATE_IN_ARCHIVE,
];

const jobSetState = async (
	token: string,
	jobId: string,
	state: string,
	callback: StatusCallbackType
) => {
	try {
		const result = await fetch(
			process.env.REACT_APP_BACKEND_API + "/api/job/state",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					id: jobId,
					state: state,
				}),
			}
		);
		const data = { status: result.status };
		callback(data);
	} catch (e) {
		console.log(e);
	}
};

function getNextState(state) {
	switch (state) {
		case JOB_STATE_QUOTATION:
			return JOB_STATE_VERIFIED;

		case JOB_STATE_VERIFIED:
			return JOB_STATE_FINISHED;

		case JOB_STATE_FINISHED:
			return JOB_STATE_IN_ARCHIVE;

		default:
			throw new Error("Invalid job state " + state + ".");
	}
}

export {
	jobSetState,
	getNextState,
	JOB_STATE_QUOTATION,
	JOB_STATE_VERIFIED,
	JOB_STATE_FINISHED,
	JOB_STATE_IN_ARCHIVE,
	JOB_STATES,
};
