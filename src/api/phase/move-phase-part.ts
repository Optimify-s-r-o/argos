import { CapacityMoveMethod } from '../../types/capacity';
import { StatusCallbackType } from '../../types/api';
import {
	METHOD_CAPACITY_ALL,
	METHOD_CAPACITY_FILL,
} from "../../components/windows/MoveCapacity";

const phasePartMove = async (
	token: string,
	phase: string,
	method: CapacityMoveMethod,
	phasePartId: string,
	toDate: string,
	capacity: number = 0,
	callback: StatusCallbackType
) => {
	let endpoint = "/api/v1/" + phase + "workingphase/";
	let body = {
		fromId: phasePartId,
		toDate: toDate,
	};

	switch (method) {
		case METHOD_CAPACITY_ALL:
			endpoint += "moveall";
			break;

		case METHOD_CAPACITY_FILL:
			endpoint += "TODO";
			break;

		default:
			if (phase === "transport") {
				endpoint += "move";
			} else {
				endpoint += "TODO";
				body["capacity"] = capacity;
			}
	}

	try {
		const result = await fetch(process.env.REACT_APP_BACKEND_API + endpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(body),
		});
		const data = { status: result.status };
		if (callback) callback(data);
	} catch (e) {
		console.log(e);
	}
};

export default phasePartMove;
