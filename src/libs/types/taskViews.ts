import { addDays, isWithinInterval } from "date-fns";
import type { TaskView } from "../../components/week";

export class TaskViews extends Array<TaskView> {
	getPerWeek(weekStart: Date): TaskView[] {
		return this.filter((t) => {
			return isWithinInterval(t.start, {
				start: weekStart,
				end: addDays(weekStart, 6),
			});
		});
	}
}
