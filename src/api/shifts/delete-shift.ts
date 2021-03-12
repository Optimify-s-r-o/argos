import { StatusCallbackType } from '../../types/api';

const deleteShift = async (
	token: string,
	phase: string,
	id: string,
	callback: StatusCallbackType
) => {
	try {
		const result = await fetch(
			process.env.REACT_APP_BACKEND_API + "/api/v1/" + phase + "shifts/" + id,
			{
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		);
		const data = { status: result.status };
		callback(data);
	} catch (e) {
		console.log(e);
	}
};

export default deleteShift;
