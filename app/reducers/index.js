import { combineReducers } from 'redux'
import dicts from './dicts'
import filters from './filters'

const dictsApp = combineReducers({
	dicts,
	filters
})

export default dictsApp