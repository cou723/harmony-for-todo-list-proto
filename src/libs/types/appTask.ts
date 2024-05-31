import type { Task } from "@doist/todoist-api-typescript";
import { addDays, differenceInDays, parse } from "date-fns";
import type { TaskView } from "../../components/week";

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

	constructor(public readonly task: Task) {
		const timeLabelText = task.labels.find((label) => isTimeLabel(label));

		if (!timeLabelText) throw new Error("Time label is not found");
		this.requireDays = new TimeLabel(timeLabelText).getDays();

		if (!task.due) throw new Error("Due is null or undefined");
		this.end = parse(task.due.date, "yyyy-MM-dd", new Date(0));
		this.start = addDays(this.end, -this.requireDays);
	}

	toTaskView(): TaskView[] {
		const taskDurations = perWeek(this.start, this.end);
		return taskDurations.map((dates) => ({
			display: this.task.content,
			length: differenceInDays(dates.end, dates.start) + 1,
			start: dates.start,
		}));
	}
}

// startからendまでを1週間ごとに区切った配列を返す
export function perWeek(start: Date, end: Date): { start: Date; end: Date }[] {
	const result = [];

	let currentStart = new Date(start);
	let currentEnd = new Date(start);

	// 週の終わり: 土曜日 (0: 日曜日, 1: 月曜日, ..., 6: 土曜日)
	const endOfWeek = 6;

	while (currentEnd < end) {
		currentEnd = new Date(currentStart);
		currentEnd.setDate(
			currentEnd.getDate() + (endOfWeek - currentEnd.getDay()),
		);

		if (currentEnd > end) {
			currentEnd = new Date(end);
		}

		result.push({
			start: new Date(currentStart),
			end: new Date(currentEnd),
		});

		currentStart = new Date(currentEnd);
		currentStart.setDate(currentStart.getDate() + 1);
	}

	return result;
}
