export const toggleSelected = (type, id) => {
	return {
		type: 'TOGGLE_SELECTED',

		item: {
			type,
			id
		}
	}
}