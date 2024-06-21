import { TodoistApi, getAuthorizationUrl } from "@doist/todoist-api-typescript";

export const authUrl = getAuthorizationUrl(
	import.meta.env.VITE_TODOIST_CLIENT as string,
	["data:read"],
	// import.meta.env.VITE_TODOIST_SECRET as string,
	Math.random().toString(36).substring(2, 15) +
		Math.random().toString(36).substring(2, 15),
);

export const api = new TodoistApi(
	import.meta.env.VITE_TODOIST_API_TOKEN as string,
);
