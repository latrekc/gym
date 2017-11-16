import { combineReducers } from 'redux'
import dicts from './dicts'
import selected from './selected'

const dictsApp = combineReducers({
	dicts,
	selected
})

export default dictsApp