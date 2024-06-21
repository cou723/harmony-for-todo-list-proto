import { addDays, isBefore, isSameDay, isWithinInterval } from "date-fns";
import { useRef } from "react";

export const Week: React.FC<{
	week: Date[];
	weekAppTasks: TaskView[];
}> = ({ week, weekAppTasks: appTasks }) => {
	return (
		<div style={{ display: "flex" }}>
			{week.map((day) => {
				const durations = appTasks
					.filter((t) => isBefore(t.start, day))
					.map((t) => ({ start: t.start, end: addDays(t.start, t.length) }));
				const overlapTaskCount = durations.filter((d1) =>
					isWithinInterval(day, d1),
				).length;
				return (
					<Day
						key={day.getDate()}
						d={day}
						tasks={appTasks.filter((t) => isSameDay(t.start, day))}
						overlapTaskCount={overlapTaskCount}
					/>
				);
			})}
		</div>
	);
};

export const Day: React.FC<{
	d: Date;
	tasks: TaskView[];
	overlapTaskCount: number;
}> = ({ d, tasks, overlapTaskCount }) => {
	const myRef = useRef<HTMLDivElement | null>(null);
	const width = 80;
	const padding = 10;
	const border = 1;
	const marginTop = overlapTaskCount * 18;

	return (
		<div
			ref={myRef}
			style={{
				display: "flex",
				flexDirection: "column",
				width: `${width}px`,
				height: "110px",
				padding: `${padding}px`,
				margin: "0px",

				borderBlockColor: "black",
				border: `solid ${border}px`,
			}}
		>
			<span
				style={{
					color: isSameDay(new Date(), d) ? "red" : "black",
					fontSize: "10px",
				}}
			>
				{d.getDate()}
			</span>
			<div
				style={{
					marginTop: `${marginTop}px`,
					display: "flex",
					gap: "2px",
					flexDirection: "column",
				}}
			>
				{tasks.map((t) => (
					<TaskView
						t={t}
						width={width}
						padding={padding}
						border={border}
						key={t.displayName + t.start.toISOString()}
					/>
				))}
			</div>
		</div>
	);
};

export type TaskView = {
	backgroundColor: string;
	displayName: string;
	length: number;
	start: Date;
	url: string;
};

const TaskView: React.FC<{
	t: TaskView;
	width: number;
	padding: number;
	border: number;
}> = ({ t, width, padding, border }) => {
	const thisPadding = 2;
	return (
		<a
			href={t.url}
			style={{
				fontSize: "10px",
				display: "block",
				borderBlockColor: "black",
				padding: `${thisPadding}px`,
				backgroundColor: t.backgroundColor,
				width: `${
					(width + padding * 2 + border * 2) * t.length -
					padding * 2 -
					border * 2 -
					thisPadding * 2
				}px`,
				zIndex: 100,
				position: "relative",
				textWrap: "nowrap",
			}}
		>
			{t.displayName}
		</a>
	);
};
