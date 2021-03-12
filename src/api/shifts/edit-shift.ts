import { CallbackType } from '../../types/api';

const editShift = async (
	token: string,
	phase: string,
	id: string,
	shiftName: string,
	capacity: number,
	callback: CallbackType
) => {
	try {
		const result = await fetch(
			process.env.REACT_APP_BACKEND_API + "/api/v1/" + phase + "shifts/" + id,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					name: shiftName,
					defaultCapacity: capacity,
				}),
			}
		);
		const data = { status: result.status, body: await result.json() };
		callback(data);
	} catch (e) {
		console.log(e);
	}
};

export default editShift;
