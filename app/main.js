import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App.js';

fetch('/data').then((response) => response.json()).then((json) => {
	ReactDOM.render(<App {...json}/>, document.getElementById('root'));
})