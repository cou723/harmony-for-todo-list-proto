import { describe, expect, it } from "vitest";
import { perWeekDuration } from "./appTask";

// https://www.benri.com/calendar/2021.html

describe("per week", () => {
	it("normal", () => {
		expect(
			perWeekDuration(new Date(2021, 0, 1), new Date(2021, 0, 2)),
		).toStrictEqual([
			{ start: new Date(2021, 0, 1), end: new Date(2021, 0, 2) },
		]);

		expect(
			perWeekDuration(new Date(2021, 0, 1), new Date(2021, 0, 3)),
		).toStrictEqual([
			{ start: new Date(2021, 0, 1), end: new Date(2021, 0, 2) },
			{ start: new Date(2021, 0, 3), end: new Date(2021, 0, 3) },
		]);

		expect(
			perWeekDuration(new Date(2021, 0, 1), new Date(2021, 0, 1)),
		).toStrictEqual([
			{ start: new Date(2021, 0, 1), end: new Date(2021, 0, 1) },
		]);

		expect(
			perWeekDuration(new Date(2021, 0, 1), new Date(2021, 0, 10)),
		).toStrictEqual([
			{ start: new Date(2021, 0, 1), end: new Date(2021, 0, 2) },
			{ start: new Date(2021, 0, 3), end: new Date(2021, 0, 9) },
			{ start: new Date(2021, 0, 10), end: new Date(2021, 0, 10) },
		]);
	});

	it("error", () => {
		expect(
			perWeekDuration(new Date(2021, 0, 3), new Date(2021, 0, 2)),
		).toStrictEqual([]);
	});
});
