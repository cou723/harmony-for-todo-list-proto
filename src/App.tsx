import { TodoistApi, getAuthToken } from "@doist/todoist-api-typescript";
import {} from "date-fns";
import queryString from "query-string";
import { useEffect, useState } from "react";
import { authUrl } from "./api";
import { Week } from "./components/week";
import { useYearAndMonth } from "./hooks/useYearAndMonth";
import { getCalendarDates } from "./libs/getCalendarDates";
import { AppTask } from "./libs/types/appTask";
import { TaskViews } from "./libs/types/taskViews";
if (import.meta.env.VITE_TODOIST_API_TOKEN === undefined)
	throw new Error("VITE_TODOIST_API_TOKEN is not defined");

function chunkArray<T>(array: T[], chunkSize: number): T[][] {
	const arrayLength = array.length;
	const tempArray = [];

	for (let index = 0; index < arrayLength; index += chunkSize) {
		const chunk = array.slice(index, index + chunkSize);
		tempArray.push(chunk);
	}

	return tempArray;
}

function App() {
	const [tasks, setTasks] = useState<AppTask[]>([]);
	const { year, month, increment, decrement } = useYearAndMonth();
	const [api, setApi] = useState<TodoistApi | null>(null);
	const param = queryString.parse(location.search);

	// codeつきリダイレクトされた際にapiをセットする
	useEffect(() => {
		const f = async () => {
			if (typeof param.code !== "string") return;

			setApi(
				new TodoistApi(
					(
						await getAuthToken({
							clientId: import.meta.env.VITE_TODOIST_CLIENT as string,
							clientSecret: import.meta.env.VITE_TODOIST_SECRET as string,
							code: param.code,
						})
					).accessToken,
				),
			);
		};
		f();
	}, [param]);

	useEffect(() => {
		const f = async () => {
			if (api === null) return;
			const projects = await api.getProjects();

			const resTasks = await api.getTasks();
			setTasks(
				resTasks
					// .filter((t) => t.labels?.some((l) => isTimeLabel(l)))
					.filter(
						(t) => t.projectId === projects.find((p) => p.name === "gc")?.id,
					)
					.filter((t) => !t.isCompleted)
					.filter((t) => t.due)
					.map((t) => new AppTask(t)),
			);
		};
		f();
	}, [api]);

	const taskViews = new TaskViews(...tasks.flatMap((t) => t.toTaskView()));
	console.log(taskViews.map((taskViews) => taskViews.displayName));

	return (
		<>
			<div style={{ display: "flex", justifyContent: "space-between" }}>
				{year}/{month}
				<div>
					<button type="button" onClick={decrement}>
						{"<"}
					</button>
					<button type="button" onClick={increment}>
						{">"}
					</button>
				</div>
				<a href={authUrl}>login</a>
			</div>
			<div style={{ display: "flex", flexDirection: "column" }}>
				{chunkArray(getCalendarDates(year, month), 7).map((week) => (
					<Week
						week={week}
						key={week.map((d) => d.getDate()).join()}
						weekAppTasks={taskViews.getPerWeek(week[0])}
					/>
				))}
			</div>
		</>
	);
}

export default App;
