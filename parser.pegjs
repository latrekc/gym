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

	function hash(name, value) {
		var result = {}
		result[name] = value;
		return result;
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
		source:text()
	}
}

SET = number:([0-9]) ")" result:EXERCISE tail:(NL? "," text2:EXERCISE)* NL {
	tail = flatten(tail);

	if(tail.length) {
		result += tail.join('');
	}

	return result;
}

EXERCISE = !([0-9] ")") TEXT {
	return text();
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