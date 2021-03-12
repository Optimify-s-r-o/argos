import { CallbackType } from '../../types/api';

const getCalendarDays = async (
	token: string,
	from: string,
	to: string,
	callback: CallbackType
) => {
	try {
		const result = await fetch(
			process.env.REACT_APP_BACKEND_API +
				"/api/v1/calendar/overview/full?from=" +
				from +
				"&to=" +
				to,
			{
				method: "GET",
				headers: {
					Accept: "application/json",
					Authorization: "Bearer " + token,
				},
			}
		);
		const data = { status: result.status, body: await result.json() };
		callback(data);
	} catch (e) {
		console.log(e);
	}
};

export default getCalendarDays;
