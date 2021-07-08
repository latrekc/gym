const filters = (state = {}, action) => {
	switch (action.type) {
		case 'TOGGLE_FILTER':
			return {
				...state,
				exercises: action.filter
			}

		default:
			return state;
	}
}

export default filters