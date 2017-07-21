{
	function _flatten(arr) {
		if(!Array.isArray(arr)) {
			return arr;
		}

		return arr.filter(i => i !== null && i !== "\n").reduce((flat, toFlatten) => {
			return flat.concat(Array.isArray(toFlatten) ? _flatten(toFlatten) : toFlatten);
		}, []);
	}

	function flatten(arr) {
		var res = _flatten(arr);
		return res && res.length == 1 ? res[0] : res;
	}

	function trim(str) {
		return str.replace(/^\s+|\s+$/g, '');
	}

	function hash(name, value) {
		var result = {}
		result[name] = value;
		return result;
	}

	function join(arr) {
		return arr.join('')
	}

	function eat_tail(head, tail) {
		if(!(head instanceof Array)) {
			head = [head];
		}

		if(tail.length) {
			head = head.concat(flatten(tail));
		}

		return head;

	}

	function node(result) {
		return [{
			text: text(),
			result:flatten(result),
			ln: location().start.line
		}]
	}

	function _prepareCaption(caption) {
		if(caption.descr instanceof Array) {
			caption.descr = caption.descr.join(' ');
		}

		if(caption.descr) {
			caption.descr = caption.descr.replace(/(^\s+|\s+$)/g, '');
		}

		return caption;
	}
}

start =  result:TRAINING+ {
	return result;
}

TRAINING = caption:(CAPTION / REVERSE_CAPTION) NL sets:SET+ (SPACE / NL)* {
	_prepareCaption(caption);

	return {
		weekday: caption.weekday,
		descr: caption.descr,
		sets,
		source:text(),
		location: location()
	}
}

SET = number:([0-9]) ")" result:EXERCISE tail:EXERCISE* NL {
	return flatten(eat_tail(result, tail));
}

COMMA_EXERCISE = "," exersise:EXERCISE {
	return exersise;
}

EXERCISE = !([0-9] ")") exersise:ONE_EXERCISE comment:COMMENT? {
	if(comment) {
		exersise.comment = comment;
	}

	return exersise;
}

ONE_EXERCISE = TRISET / SUPERSET / CIRCLE / ROUTINE

SUPERSET = first:ROUTINE SPACE* "+" SPACE* second:ROUTINE {
	return {
		superset: [
			first, second
		]
	}
}

TRISET = first:ROUTINE SPACE* "+" SPACE* second:ROUTINE "+" SPACE* third:ROUTINE {
	return {
		triset: [
			first, second, third
		]
	}
}


CIRCLE = first:ROUTINE tail:COMMA_ROUTINE+ {
	return {
		circle: eat_tail(first, tail)
	}
}

COMMA_ROUTINE = "," routine:ROUTINE {
	return routine;
}

ROUTINE = name:([А-я ё0-9]+) weights:WEIGHTS? SPACE* {
	name = trim(join(name));

	return weights ? {
		name, weights
	} : {name} ;
}

COMMENT = "#" text:[А-яA-z ё0-9(),]+ {
	return join(text);
}

WEIGHTS = "(" SPACE* weights:WEIGHT tail:COMMA_WEIGHT* SPACE* (")" / !NL) {
/*	
	if(location().start.line === 877) {
		console.log(location().start.line,  text());

		console.log('[1]')
		console.log('w', JSON.stringify(weights, null, "\t"));
		console.log('t', JSON.stringify(tail, null, "\t"));
	}
*/
	weights = eat_tail(weights, [tail])
/*
	if(location().start.line === 877) {
		console.log('[2]')
		console.log('w', JSON.stringify(weights, null, "\t"));
		console.log('t', JSON.stringify(tail, null, "\t"));
		console.log("\n\n\n");
	}
*/
	let res = [];
	let pos = 0;

	weights.forEach((i,p)=>{
		if(p && (i.weight === 5 || i === 5)) {
			if (res[pos-1].weight) {
				res[pos-1].weight = parseFloat(res[pos-1].weight + '.5');

			} else {
				res[pos-1] = parseFloat(res[pos-1] + '.5');
			}

		} else {
			res[pos] = i;
			pos++;
		}
	})	

	return flatten(res);
}

COMMA_WEIGHT = [,\-х] weight:WEIGHT {
	return weight;
}

WEIGHT =
	weight:WEIGHT_VALUE repeats:SHORT_REPEATS {
		return repeats ? {
			weight,
			repeats
		} : weight
	}
/
	repeats:SHORT_REPEATS weight:WEIGHT_VALUE {
		return repeats ? {
			weight,
			repeats
		} : weight
	}
/
	(("по" / "от") SPACE*)? weight:WEIGHT_VALUE repeats:REPEATS? "кг"? {
		return repeats ? {
			weight,
			repeats
		} : weight
	}

WEIGHT_VALUE = weight:[0-9]+ {
	return parseFloat(join(weight));
}

SHORT_REPEATS = SPACE* "(" times:[0-9]+ ")" SPACE*  {
	return {
		times: parseInt(join(times))
	}
}

REPEATS = first:REPEAT tail:COMMA_REPEAT* {
	return eat_tail(first,tail)
}

COMMA_REPEAT = "," repeat:REPEAT {
	return repeat;
}

REPEAT = SPACE* times:[0-9]+ "х" reps:[0-9]+ SPACE* {
	return {
		times: parseInt(join(times)),
		reps:parseInt(join(reps))
	}
}

EMPTY = ""

LB = "("

RB = ")"

NL = [\n]+

SPACE = [ \t]+

WEEKDAY = day:("Понедельник" / "Вторник" /  "Среда" / "Четверг" / "Пятница" / "Суббота" / "Воскресенье" / "Пон") {
	if(day === "Пон") {
		return "Понедельник";
	}

	return day;
}

TEXT = [A-zА-яё0-9, ()\+:\-]+ {
	return text();
}

DECRIPTION = !([0-9] ")") TEXT {
	return text();
}

CAPTION = weekday:WEEKDAY ":"? caption:(NL? text:DECRIPTION (NL DECRIPTION)*)? {
	return { weekday, descr: flatten(caption) };
}

REVERSE_CAPTION = caption:(text:DECRIPTION) NL weekday:WEEKDAY ":" {
	return { weekday, descr: flatten(caption) };
}