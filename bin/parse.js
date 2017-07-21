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

let parser = require("pegjs").buildParser(fs.readFileSync('parser.pegjs', 'utf-8'), {
	debug: true,
//	trace: true
});

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
	result = parser.parse(source)

	if(result) {
	//	showSource();

		let exercises = {};

		result
			.map((line, number) => {
				let isDropset;
				let mode;
				// режим тренировки
				if(line.descr) {
					isDropset = line.descr.toLowerCase().match(/дроп сет/) !== null;
					mode = line.descr.match(/\d+[хx]\d+/g);
				}

				// уплощение сетов
				let sets = [];
				line.sets.forEach((set) => {
					switch(true) {
						case set.hasOwnProperty('circle'):
							set.circle.forEach(subset => {
								subset.type = 'circle';
								sets.push(subset);
							});
							break;

						case set.hasOwnProperty('triset'):
							set.triset.forEach(subset => {
								subset.type = 'triset';
								sets.push(subset);
							});
							break;

						case set.hasOwnProperty('superset'):
							set.superset.forEach(subset => {
								subset.type = 'superset';
								sets.push(subset);
							});
							break;

						default:
							set.type = 'simple';
							sets.push(set);
							break;
					}
				});

				line.sets = sets.map(set => {
					if(set.weights && typeof set.weights !== 'number') {
						set.weights = Math.max.apply(null, (set.weights instanceof Array ? set.weights : [set.weights]).map(w => {
							return w.weight || w;
						}));
					}

					if(isDropset) {
						set.type = 'dropset';
					}

					if(mode) {
						set.mode = mode[0];

					} else if (set.mode == 'superset') {
						set.mode = '3х12';
						
					}

					// нормализация названия упражнения
					let exercise = set.name
						.toLowerCase()
						.replace(/биц бёдра/, 'биц бедра')
						.replace(/лёжа гант/, 'гант лёжа')
						.replace(/лежа/, 'лёжа')
						.replace(/^биц /, 'бицепс ')
					;

					if(!exercises[exercise]){
						exercises[exercise] = 0;
					}
					exercises[exercise]++;
					set.name = exercise;

					return set;
				});

				return line;
			})
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
		console.log(JSON.stringify((Object.keys(exercises).sort() || ''), null, "\t").red);
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