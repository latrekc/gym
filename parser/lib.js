const fs = require('fs');

const groups = {
	'грудь': [],
	'спина': [],
	'ноги': [],

	'плечи': [],
	'бицепс': [],
	'трицепс': [],
	'пресс': []
}

function normalize(name) {
	return name
		.toLowerCase()
		.replace(/биц бёдра/, 'биц бедра')
		.replace(/лёжа гант/, 'гант лёжа')
		.replace(/лежа/, 'лёжа')
		.replace(/^биц /, 'бицепс ')
		.replace(/^триц /, 'трицепс ')
		.replace(/^сгибан /, 'сгибание ')
		.replace(/\s+[х0-9]+$/, '')
	;
}

exports.parse = function (source){
	let parser = require("pegjs").buildParser(fs.readFileSync(__dirname + '/parser.pegjs', 'utf-8'), {
		debug: true,
	//	trace:true
	});

	let result = parser.parse(source);

	let exercises = {};

	let workouts = result
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
				let exercise = normalize(set.name);

				if(!exercises[exercise]){
					exercises[exercise] = 0;
				}
				exercises[exercise]++;
				set.name = exercise;

				return set;
			});

			return line;
		})
	;

	return {
		exercises: exercises,
		workouts: workouts,
		groups: groups
	}
}