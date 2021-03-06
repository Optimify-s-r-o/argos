import { StatusCallbackType } from '../../types/api';

const jobAutoplan = async (
	token: string,
	id: string,
	deadline: string,
	callback: StatusCallbackType
) => {
	try {
		const result = await fetch(
			process.env.REACT_APP_BACKEND_API + "/api/v1/jobs/autoplan",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					id: id,
					deadline: deadline,
				}),
			}
		);
		const data = { status: result.status };
		callback(data);
	} catch (e) {
		console.log(e);
	}
};

export default jobAutoplan;
