#!/usr/bin/env node

class Workout {
	constructor (source) {
		const rows = source.split(/\n/);
		this.parseCaption(rows.shift());

		rows.forEach(this.parseExercise.bind(this));
	}

	parseExercise(source) {
		let m = source.match(/^(\d+)\)(.+)$/);

		if(!m) {
			this.caption += source;
			return;
		}

		source = m[2];

		console.log(source.split(/\s*\+\s*/).length)
	}

	parseCaption(source) {
		let parts = source.split(/\s*:\s*/);
		this.weekday = parts.shift();

		if(!this.weekday) {
			throw new Error('Can\'t match weekday');
		}

		this.caption = parts.join(': ');
	} 
}



require('fs').readFileSync('data.txt', 'UTF-8').split(/\n{2,}/).map((source) => {
	console.log(source, "\n======================");
	let item = new Workout(source);

//	console.log(item);
	console.log();
});