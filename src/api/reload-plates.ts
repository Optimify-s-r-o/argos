import { CallbackType } from '../types/api';

const reloadPlates = async (
	token: string,
	plates: any,
	callback: CallbackType
) => {
	try {
		const result = await fetch(
			process.env.REACT_APP_BACKEND_API + "/api/v1/plates",
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(plates),
			}
		);
		const data = { status: result.status, body: await result.json() };
		callback(data);
	} catch (e) {
		console.log(e);
	}
};

export default reloadPlates;
