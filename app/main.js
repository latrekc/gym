import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import dictsApp from './reducers'
import App from './components/App'

fetch('/data').then((response) => response.json()).then((dicts) => {
	let store = createStore(dictsApp, {
		dicts,
		filters: []
	});

	render(
		<Provider store={store}>
			<App/>
		</Provider>,

		document.getElementById('root')
	);
})