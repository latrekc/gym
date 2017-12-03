const filters = (state = [], action) => {
	switch (action.type) {
		case 'TOGGLE_FILTER':
			if(state.some(filter => filter === action.filter)) {
				return state.filter(filter => filter !== action.filter);

			} else {
				return state.concat(action.filter);
			};

		default:
			return state;
	}
}

export default filters