import { getMonth, getYear } from "date-fns";
import { useReducer } from "react";

export function useYearAndMonth() {
	const today = new Date();

	const [state, dispatch] = useReducer(reducer, {
		month: getMonth(today) + 1,
		year: getYear(today),
	});

	return {
		year: state.year,
		month: state.month,
		increment: () => dispatch({ type: "INCREMENT" }),
		decrement: () => dispatch({ type: "DECREMENT" }),
	};
}

type Action = {
	type: "INCREMENT" | "DECREMENT";
};

type State = {
	year: number;
	month: number;
};

function reducer(state: State, action: Action): State {
	switch (action.type) {
		case "INCREMENT":
			if (state.month === 12) return { year: state.year + 1, month: 1 };
			return { year: state.year, month: state.month + 1 };
		case "DECREMENT":
			if (state.month === 1) return { year: state.year - 1, month: 12 };
			return { year: state.year, month: state.month - 1 };
	}
}
