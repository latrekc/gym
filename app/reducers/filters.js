const filters = (state = [], action) => {
	switch (action.type) {
		case 'TOGGLE_FILTER':
			const {exercise, type, mode} = action.filter;

			if(state.some(item => item.exercise === exercise && item.type === type && item.mode === mode)) {
				return state.filter(item => !(item.exercise === exercise && item.type === type && item.mode === mode));

			} else {
				return state.concat(action.filter);
			};

		default:
			return state;
	}
}

export default filters