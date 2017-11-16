import React from 'react';
import { connect } from 'react-redux'
import { toggleSelected } from '../actions'

import List from './List'

function App({ groups, modes, exercises, types, onSelect })  {
	return (
		<div>
			<List type="groups" list={groups} onSelect={onSelect} />
			<List type="modes" list={modes} onSelect={onSelect} />
			<List type="types" list={types} onSelect={onSelect} />
			<List type="exercises" list={exercises} onSelect={onSelect} />
		</div>
	);
}


const getCheckedList = (state, type) => {
	return state.dicts[type].map(item => {
		item.selected = state.selected[type].includes(item.id)
		return item;
	})
} 

const mapStateToProps = state => {
	return {
		groups: getCheckedList(state, 'groups'),
		modes: getCheckedList(state, 'modes'),
		types: getCheckedList(state, 'types'),
		exercises: getCheckedList(state, 'exercises')
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onSelect: (type, id) => {
			dispatch(toggleSelected(type, id))
		}
	}
}


export default connect(
	mapStateToProps,
	mapDispatchToProps
)(App)
