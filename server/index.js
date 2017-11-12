/* eslint no-console: 0 */

const fs = require('fs');
const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.config.js');
const parse = require('./parser/lib').parse;

const port = 3000;

const isDeveloping = process.env.NODE_ENV !== 'production';
const app = express();

const compiler = webpack(config);
const middleware = webpackMiddleware(compiler, {
	publicPath: config.output.publicPath,
	contentBase: 'src',
	stats: {
		colors: true,
		hash: false,
		timings: true,
		chunks: false,
		chunkModules: false,
		modules: false
	}
});

app.use(express.static(__dirname + '/../public'));
app.use(middleware);
app.use(webpackHotMiddleware(compiler));

app.get('/data', function response(req, res) {
	try {
		res.json(parse().result);
		res.end();

	} catch(e) {
		res.status(500).json(e);
	}
});

app.get('*', function response(req, res) {
	res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/index.html')));
	res.end();
});

app.listen(port, '0.0.0.0', function onStart(err) {
	if (err) {
		console.log(err);
	}
	console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});
