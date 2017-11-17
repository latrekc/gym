const fs = require('fs');

function addDict(dict) {
	let keys = {};

	return function(name) {
		if(!keys[name]) {
			let id = dict.length + 1;
			dict.push({ name, id})
			keys[name] = id;
			dict.sort((a,b) => a.name.localeCompare(b.name));
		}

		return keys[name];
	}
}

function find(list, value, field='name') {
	if(value) {
		return list.find(i => i[field] === value);
	}
}

let groups = [];
['грудь', 'спина', 'ноги',  'плечи', 'бицепс', 'трицепс', 'пресс'].forEach(addDict(groups));

exports.parse = function (saveLocation){
	const parser = require("pegjs").buildParser(fs.readFileSync(__dirname + '/parser.pegjs', 'utf-8'), {
		debug: true,
	//	trace:true
	});
	const sourceFile = __dirname + '/data.txt';

	const source = fs.readFileSync(sourceFile, 'UTF-8') + "\n";

	let lastDay = fs.statSync(sourceFile).mtime;

	let types = [];
	let modes = [];
	let exercises = [];

	let addType = addDict(types);
	let addMode = addDict(modes);
	let addExercise = (function(normalize, chooseGroup) {
		let _add = addDict(exercises);

		return function(name) {
			name = normalize(name);
			let id = _add(name);
			let group = find(groups, chooseGroup(name));

			if(group) {
				if(!group.exercises) {
					group.exercises = [];
				}

				if(!group.exercises.includes(id)) {
					group.exercises.push(id);
				}
			}

			return id;
		}

	})((name) => {
		return name
			.toLowerCase()
			.replace(/биц бёдра/, 'биц бедра')
			.replace(/лёжа гант/, 'гант лёжа')
			.replace(/ узу /, ' узк ')
			.replace(/лежа/, 'лёжа')
			.replace(/^биц /, 'бицепс ')
			.replace(/^триц /, 'трицепс ')
			.replace(/^сгибан /, 'сгибание ')
			.replace(/\s+[х0-9]+$/, '')
		;
	}, (name) => {
		function _() {
			return Array.prototype.some.call(arguments, (type) => {
				return !!name.match(type);
			});
		}

		switch(true) {
			case _('бок', 'планка', 'скруч', 'пресс'):
				return 'пресс';

			case _('выпады', 'бедра', 'ногами', 'присед', 'разгиб', 'сгибание'): 
				return 'ноги';

			case _('жим из за головы', 'трицепс'):
				return 'трицепс';

			case _('арни', 'плечи', 'подбородку', 'махи'):
				return 'плечи';

			case _('тяга', 'тяги', 'гиперэкстензия', 'горизонт', 'становая'):
				return 'спина';

			case _('бицепс'):
				return 'бицепс';

			case _('пулловер', 'жим', 'бабочка', 'кроссовер', 'разводка'):
				return 'грудь';

			default:
				throw new Error('Undefined group: ', name);
		}
	})

	let workouts = parser.parse(source)
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
							subset.type = addType('круги');
							sets.push(subset);
						});
						break;

					case set.hasOwnProperty('triset'):
						set.triset.forEach(subset => {
							subset.type = addType('трисет');
							sets.push(subset);
						});
						break;

					case set.hasOwnProperty('superset'):
						set.superset.forEach(subset => {
							subset.type = addType('суперсет');
							sets.push(subset);
						});
						break;

					default:
						set.type = addType('сет');
						sets.push(set);
						break;
				}
			});

			let result = {
				weekday: line.weekday,
				descr: line.descr,
				sets: sets.map(set => {
					if(set.weights && typeof set.weights !== 'number') {
						set.weights = Math.max.apply(null, (set.weights instanceof Array ? set.weights : [set.weights]).map(w => {
							return w.weight || w;
						}));
					}

					if(isDropset) {
						set.type = addType('дропсет');
					}

					if(mode) {
						set.mode = addMode(mode[0]);

					} else if (set.mode == 'superset') {
						set.mode = addMode('3х12');
				
					}

					if(set.mode) {
						let type = find(types, set.type, 'id');
						if(!type.modes) {
							type.modes = [];
						}
						if(!type.modes.includes(set.mode)) {
							type.modes.push(set.mode)
						}
					}

					set.exercise = addExercise(set.name)
					delete set.name;

					return set;
				})
			};

			if(saveLocation) {
				result.source = line.source;
				result.location = line.location;
			}

			return result;
		})
	;

	function getPrevious(weekday) {
		while(lastDay.getDay() !== weekday) {
			lastDay.setDate(lastDay.getDate() - 1);
		}

		let result = lastDay.toString();

		lastDay.setDate(lastDay.getDate() - 1);

		return result;
	}

	workouts.reverse().forEach((set) => {
		set.date = getPrevious(set.weekday);
		delete set.weekday;
	})

	return {
		source,
		result: {
			exercises: exercises,
			workouts: workouts.reverse(),
			types: types,
			modes: modes,
			groups: groups
		}
	}
}