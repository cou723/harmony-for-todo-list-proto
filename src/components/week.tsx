import { isSameDay } from "date-fns";
import { useRef } from "react";

export const Week: React.FC<{
	week: Date[];
	appTasks: TaskView[];
}> = ({ week, appTasks }) => {
	return (
		<div style={{ display: "flex" }}>
			{week.map((d) => (
				<Day
					key={d.getDate()}
					d={d}
					tasks={appTasks.filter((t) => isSameDay(t.start, d))}
				/>
			))}
		</div>
	);
};

export const Day: React.FC<{
	d: Date;
	tasks: TaskView[];
}> = ({ d, tasks }) => {
	const myRef = useRef<HTMLDivElement | null>(null);
	const width = 80;
	const padding = 10;
	const border = 1;

	console.log(tasks);

	return (
		<div
			ref={myRef}
			style={{
				width: `${width}px`,
				height: "100px",
				padding: `${padding}px`,
				margin: "0px",
				gap: "2px",
				borderBlockColor: "black",
				border: `solid ${border}px`,
			}}
		>
			<div>{d.getDate()}</div>
			{tasks.map((t) => (
				<TaskView
					t={t}
					width={width}
					padding={padding}
					border={border}
					key={t.display + t.start.toISOString()}
				/>
			))}
		</div>
	);
};

export type TaskView = {
	display: string;
	length: number;
	start: Date;
};

export const TaskView: React.FC<{
	t: TaskView;
	width: number;
	padding: number;
	border: number;
}> = ({ t, width, padding, border }) => {
	return (
		<div
			style={{
				borderBlockColor: "black",
				padding: `${0}px`,
				backgroundColor: "lightblue",
				width: `${
					(width + padding * 2 + border * 2) * t.length -
					padding * 2 -
					border * 2
				}px`,
			}}
		>
			{t.display}
		</div>
	);
};
