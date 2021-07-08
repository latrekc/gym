import React from 'react'

import { Component } from 'react';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";


export default class Graph extends Component {
	componentDidMount() {
		let chart = am4core.create("chartdiv", am4charts.XYChart);

		chart.data = [];

		// ... chart code goes here ...
		this.chart = chart;
		this._updateChart('render', this.props);
	}

	componentWillUnmount() {
		if (this.chart) {
			this.chart.dispose();
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		this._updateChart('shouldComponentUpdate', nextProps);
		return false;
	}

	_updateChart(from, props) {
		const { logs, exercises, typemodes } = props;

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
		this.chart.data = logs.data;
		console.warn(from, graphs, logs.data);
	}

	render() {
		return (
			<div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>
		);
	}
}

/*
import AmCharts from 'amchart4-reac';

export default function Graph()  {


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
*/