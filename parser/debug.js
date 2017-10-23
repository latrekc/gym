#!/usr/bin/env node
require('colors');
const fs = require('fs');

const parse = require('./lib').parse;

function hr() {
	var space = [];
	for(var i=0; i < process.stdout.columns; i++) {
		space.push(' ');
	}
	console.log(space.join('').inverse)
}

let source = fs.readFileSync(__dirname + '/data.txt', 'UTF-8') + "\n";

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
	result = parse(source)

	if(result) {
		showSource();
		result.workouts

//			.slice(157,158)
//			.filter(i=>i.descr)
			.forEach((line, number) => {
				if(!line) {
					console.log('NOT LINE', line)
					process.exit()
				} else {
					let s = line.source;
					let l = line.location;
					delete line.source;
					delete line.location;

					//console.log(number.toString().blue, l.start.line.toString().red, s, (line.descr||'').cyan)
					console.log(number.toString().blue, l.start.line.toString().red, (line.descr||'').cyan)
					line.sets.forEach((set) => {
						console.log(JSON.stringify((set || ''), null, "\t").yellow)
					})
					console.log();
				}
			})
		;

		;
		console.log(JSON.stringify((Object.keys(result.exercises).sort() || ''), null, "\t").red);
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