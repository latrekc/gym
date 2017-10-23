import React from 'react';
import styles from './App.css';

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			test: 'xxx'
		};
	}
	render() {
		return (<div className={styles.app}>gym</div>);
	}
}
