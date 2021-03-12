import { CallbackType } from '../../types/api';

const userAuth = async (
	username: string,
	password: string,
	callback: CallbackType
) => {
	try {
		const result = await fetch(
			process.env.REACT_APP_BACKEND_API + "/api/v1/users/auth",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify({
					email: username,
					password: password,
				}),
			}
		);
		const data = { status: result.status, body: await result.json() };
		callback(data);
	} catch (e) {
		const data = { status: 503, body: null };
		callback(data);
	}
};

export default userAuth;
