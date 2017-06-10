#!/usr/bin/env node
require('colors');
const fs = require('fs');

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

let parser = require("pegjs").buildParser(fs.readFileSync('parser.pegjs', 'utf-8'));
let source = fs.readFileSync('data.txt', 'UTF-8') + "\n";

function hr() {
	var space = [];
	for(var i=0; i<process.stdout.columns; i++) {
		space.push(' ');
	}
	console.log(space.join('').inverse)
}

function showSource(location) {
	hr();

	console.log(source.split(/\n/).map((line, i) => {
		var ln = (i+1) + '';

		if(location) {
			if(location.start.line === (i + 1)) {
				var first = line.substr(0, location.start.column - 1);

				if(location.start.line == location.end.line) {
					line = first + line.substr(location.start.column - 1, location.end.column - location.start.column).inverse.red + line.substr(location.end.column - 1);

				} else {
					line = first + line.substr(location.start.column - 1).inverse.red;
				}

				ln = ln.inverse.red;

			} else if (location.end.line === (i + 1)) {
				var first = line.substr(0, location.end.column - 1);
				line = first + line.substr(location.end.column - 1).inverse.red;
				ln = ln.inverse.red;
			
			} else if (location.start.line < (i + 1) && (i + 1) < location.end.line ){
				line = line.inverse.red;
				ln = ln.inverse.red;
			}
		}

		return ln + ' ' + line

	}).join("\n"));
	console.log()
}

let result;

try {
	result = parser.parse(source, {
		debug: true,
	})

	if(result) {
		showSource();

		result.forEach((line, number) => {
			if(!line) {
				console.log('NOT LINE', line)
				process.exit()
			} else {
				console.log(number.toString().blue, JSON.stringify((line || ''), null, "\t").yellow)
				console.log();
			}
		})
	}

} catch(e) {
	showSource(e.location);

	console.error(e.message.red)
	if(e.location) {
		console.error(JSON.stringify(e.location, null, "\t").red)
	}
	process.exit()
}

console.log()
console.log()
console.log()