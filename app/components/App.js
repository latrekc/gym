import React from 'react';
import { connect } from 'react-redux'
import { toggleFilter } from '../actions'

import GroupsList from './GroupsList'
import ExercisesList from './ExercisesList'
import SelectableList from './SelectableList'

function App({ groups, exercises, typemodes, filters, onSelect })  {
	return (
		<div>
			<GroupsList list={groups} filterChildren={filterChildren.bind(null, 'groups', 'exercises')}>
				<ExercisesList list={exercises} filterChildren={filterChildren.bind(null, 'exercises', 'typemodes')}>
					<SelectableList list={typemodes} onSelect={onSelect} filters={filters} />
				</ExercisesList>
			</GroupsList>
		</div>
	);
}

const filterChildren = (parentType, type, parent, children ) => {
	if (children) {
		return React.Children.map(children, child => {
			return parent[type] && React.cloneElement(child, {
				...child.props,
				[parentType]: parent.id,
				list: child.props.list.filter(grandChild => {
					return parent[type].includes(grandChild.id);
				})
			});
		});
	}
}

const getTypemodes = (state) => {
	let result = [];

	state.dicts.types.forEach(type => {
		result.push({
			id: `${type.id}`,
			name: `${type.name}`,
			type: `${type.id}`
		});

		state.dicts.modes.forEach(mode => {
			result.push({
				id: `${type.id};${mode.id}`,
				name: `${type.name} ${mode.name}`,
				type: `${type.id}`,
				mode: `${mode.id}`
			});
		});
	});

	return result;
}

const mapStateToProps = state => {
	return {
		groups: state.dicts.groups,
		exercises: state.dicts.exercises,
		typemodes: getTypemodes(state),
		filters: state.filters
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onSelect: (filter) => {
			dispatch(toggleFilter(filter))
		}
	}
}


export default connect(
	mapStateToProps,
	mapDispatchToProps
)(App)
