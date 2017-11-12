import React from 'react';
import Exercises from '../Exercises/Exercises'

export default class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			...props
		}
	}

	render() {
		console.log(this.state)
		return (
			<div>
				<Exercises
					list={Object.keys(this.state.exercises).sort()}
					handle
				/>
			</div>
		);
	}
}
