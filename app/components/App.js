import React from 'react';
import { connect } from 'react-redux'
import { toggleFilter } from '../actions'

import Groups from './Groups'
import Exercises from './Exercises'
import Workouts from './Workouts'

function App({ groups, exercises, typemodes, filters, logs, onSelect })  {
	return (
		<div>
			<Workouts logs={logs} exercises={exercises} typemodes={typemodes} />

			<Groups list={groups} filterChildren={filterChildren}>
				<Exercises list={exercises} onSelect={onSelect} filters={filters} />
			</Groups>
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

const getTypemodes = (types, modes) => {
	let result = [];

	types.forEach(type => {
		result.push({
			id: `${type.id}`,
			name: `${type.name}`,
			type: `${type.id}`
		});

		modes.forEach(mode => {
			let name;

			switch (type.name) {
				case 'сет':
					name = '';
					break;

				default:
					name = `(${type.name})`;
					break;
			}

			result.push({
				id: `${type.id};${mode.id}`,
				name: `${mode.name}${name}`,
				type: `${type.id}`,
				mode: `${mode.id}`
			});
		});
	});

	return result;
}

const getLogs = (workouts, filters) => {
	let result = {
		data: [],
		types: []
	};

	workouts.forEach(workout => {
		let log;

		workout.sets.forEach(item => {
			if (filters.exercises == item.exercise) {
				let key = [item.exercise, item.type, item.mode].join(';');

				if (!log) {
					log = {};
				}

				log[key] = item.weights;

				if (!result.types.includes(key)) {
					result.types.push(key);
				}
			}
		});

		if (log) {
			log.date = workout.date;
			log.descr = workout.descr;

			result.data.push(log);
		}
	});

	return result;
}

const mapStateToProps = state => {
	return {
		groups: state.dicts.groups,
		exercises: state.dicts.exercises,
		typemodes: getTypemodes(state.dicts.types, state.dicts.modes),
		filters: state.filters,
		logs: getLogs(state.workouts, state.filters)
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
