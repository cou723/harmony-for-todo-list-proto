import type { Task } from "@doist/todoist-api-typescript";
import { addDays, differenceInDays, format, isAfter, parse } from "date-fns";
import type { TaskView } from "../../components/week";

function dateToString(date: Date): string {
	return format(date, "yyyy-MM-dd");
}

export function isTimeLabel(label: string): boolean {
	return /[1-9][0-9]*[w,d]/g.test(label);
}

export class TimeLabel {
	unit: "day" | "week";
	amount: number;
	constructor(public readonly label: string) {
		if (label[label.length - 1] === "d") this.unit = "day";
		else this.unit = "week";
		this.amount = Number.parseInt(label.slice(0, -1), 10);
	}

	getDays(): number {
		return this.unit === "day" ? this.amount : this.amount * 7;
	}
}

export class AppTask {
	public requireDays: number;
	public start: Date;
	public end: Date;
	public color: string;

	constructor(public readonly task: Task) {
		const timeLabelText = task.labels.find((label) => isTimeLabel(label));

		// if (!timeLabelText) throw new Error("Time label is not found");
		this.requireDays = timeLabelText
			? new TimeLabel(timeLabelText).getDays()
			: 1;

		if (this.requireDays < 1) throw new Error("Require days is less than 1");

		if (!task.due) throw new Error("Due is null or undefined");
		this.end = parse(task.due.date, "yyyy-MM-dd", new Date(0));
		this.start = addDays(this.end, -this.requireDays + 1);
		this.color = `hsl(${getRandomInt()}deg, 100%, 80%)`;
		// console.log(dateToString(this.start), dateToString(this.end));
	}

	toTaskView(): TaskView[] {
		const taskDurations = perWeekDuration(this.start, this.end);

		return taskDurations.map((dates) => ({
			backgroundColor: this.color,
			displayName: this.task.content,
			length: differenceInDays(dates.end, dates.start) + 1,
			start: dates.start,
			url: this.task.url,
		}));
	}
}

// datesは連続した日付の配列であることを前提とする
function perWeek(dates: Date[]): Date[][] {
	const result: Date[][] = [];
	let tmp: Date[] = [];
	for (const date of dates) {
		tmp.push(date);
		if (date.getDay() === 6 || date === dates[dates.length - 1]) {
			tmp.push(date);
			result.push(tmp);
			tmp = [];
		}
	}
	return result;
}

// startからendまでを1週間ごとに区切った配列を返す
export function perWeekDuration(
	start: Date,
	end: Date,
): { start: Date; end: Date }[] {
	if (isAfter(start, end)) return [];
	const weeks = perWeek(durationToDates(start, end));
	return weeks.map((week) => ({
		start: week[0],
		end: week[week.length - 1],
	}));
}

function getRandomInt() {
	return Math.floor(Math.random() * 360);
}

// include end
function durationToDates(start: Date, end: Date): Date[] {
	const result: Date[] = [];
	const current = new Date(start);
	while (current <= end) {
		result.push(new Date(current));
		current.setDate(current.getDate() + 1);
	}
	// result.push(new Date(end));
	return result;
}
