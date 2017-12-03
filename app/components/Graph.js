import React from 'react';
import AmCharts from '@amcharts/amcharts3-react';

export default function Graph({ logs, exercises, typemodes })  {
	const findName = (id, dict) => {
		return dict.find(item => item.id == id).name;
	}

	const getTitle = (filter) => {
		let ids = filter.split(/;/).filter(id => id);

		return [
			findName(ids.shift(), exercises),
			findName(ids.join(';'), typemodes)

		].join(', ')
	}

	let graphs = logs.types.map(filter => {
		return {
			id: filter,
			balloonText: '<b>[[title]]</b><br>[[category]]: <b>[[value]]</b>',
			bullet:'circle',
			title: getTitle(filter),
			valueField: filter
		}
	});

	let style = {
		width: "100%",
		height: "500px"
	};

	let config = {
		"type": "serial",
		"categoryField": "date",
		//"dataDateFormat": "YYYY-MM-DD",
		"theme": "light",
		"categoryAxis": {
			"parseDates": true
		},
		"chartCursor": {
			"enabled": true
		},
		"chartScrollbar": {
			"enabled": true
		},
		"trendLines": [],
		"graphs": graphs,
		"guides": [],
		"valueAxes": [
			{
				"id": "ValueAxis-2",
				"title": "Вес, килограмм",
				"minimum": 0
			}
		],
		"allLabels": [],
		"balloon": {},
		"legend": {
			"enabled": true
		},
		"precision": 1,
		"dataProvider": logs.data
	};

	return (
		<div style={{ margin: '10px' }}>
			<AmCharts.React style={style} options={config} />
		</div>
	);
}
