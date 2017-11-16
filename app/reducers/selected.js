const selected = (state = {}, action) => {
	switch (action.type) {
		case 'TOGGLE_SELECTED':
			const {type, id} = action.item;

			if(state[type].includes(id)) {
				return {
					...state,
					[type]: state[type].filter(sid => id !== sid)
					
				};

			} else {
				return {
					...state,
					[type]: state[type].concat(id)
				};
			};

		default:
			return state;
	}
}

export default selected