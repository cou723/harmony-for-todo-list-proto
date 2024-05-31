import { lastDayOfMonth } from "date-fns";
import { useEffect, useState } from "react";
import { api } from "./api";
import { Week } from "./components/week";
import { getCalendarDates } from "./libs/getCalendarDates";
import { AppTask, isTimeLabel } from "./libs/types/appTask";

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
	const [month, setMonth] = useState(5);
	const [year, setYear] = useState(2024);

	const lastDateOfMonth = lastDayOfMonth(`${year}-${month}-01`).getDate();

	useEffect(() => {
		const f = async () => {
			const resTasks = await api.getTasks();
			setTasks(
				resTasks
					.filter((t) => t.labels?.some((l) => isTimeLabel(l)))
					.filter((t) => !t.isCompleted)
					.map((t) => new AppTask(t)),
			);
			console.log(resTasks);
		};
		f();
	}, []);

	return (
		<>
			{year}/{month}/{lastDateOfMonth}
			<button
				type="button"
				onClick={() => {
					if (month === 12) {
						setYear(year + 1);
						setMonth(1);
					} else setMonth(month + 1);
				}}
			>
				up
			</button>
			<button
				type="button"
				onClick={() => {
					if (month === 1) {
						setYear(year - 1);
						setMonth(12);
					} else setMonth(month - 1);
				}}
			>
				down
			</button>
			<div style={{ display: "flex", flexDirection: "column" }}>
				{chunkArray(getCalendarDates(year, month), 7).map((week) => (
					<Week
						week={week}
						key={week.map((d) => d.getDate()).join()}
						appTasks={tasks.flatMap((t) => t.toTaskView())}
					/>
				))}
			</div>
		</>
	);
}

export default App;
