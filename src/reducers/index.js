import { combineReducers } from 'redux'

import dicts from './dicts';
import filters from './filters';
import workouts from './workouts';

const dictsApp = combineReducers({
	dicts,
	workouts,
	filters
});

export default dictsApp;