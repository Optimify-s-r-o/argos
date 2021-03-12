import { CallbackType } from '../../types/api';
import { JobSort } from '../../types/job';
import { SortOptions } from '../../components/table';

const jobsGet = async (
	token: string,
	callback?: CallbackType,
	page?: number | null,
	pageSize?: number | null,
	sort?: JobSort | null,
	filter?: string | null
) => {
	try {
		let requestString = process.env.REACT_APP_BACKEND_API + "/api/v1/jobs?";
		requestString += page ? "page=" + page + "&" : "";
		requestString += pageSize ? "pageSize=" + pageSize + "&" : "";

		if (sort) {
			requestString += "sort=";
			sort.forEach((sortParam) => {
				requestString += sortParam.column;

				if (sortParam.direction !== SortOptions.Default)
					requestString +=
						"+" + (sortParam.direction === SortOptions.Desc ? "desc" : "asc");

				requestString += ",";
			});
			requestString = requestString.slice(0, -1);
			requestString += "&";
		}

		// TODO filter
		requestString = requestString.slice(0, -1);

		const result = await fetch(requestString, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
		const data = { status: result.status, body: await result.json() };
		callback && callback(data);
	} catch (e) {
		console.log(e);
	}
};

export default jobsGet;
