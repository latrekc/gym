const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const { parse } = require('./server/parser/lib');

module.exports = {
	entry: {
		app: './src/index.jsx',
	},

	mode: 'development',
	devtool: 'inline-source-map',
	devServer: {
		contentBase: './dist',
		port: 8080,
		setup: function(app, server) {
			app.get('/data', function(req, res) {
				res.json(parse().result);
			});
		}
	},

	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, './dist')
	},
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			title: 'gym results'
		})
	],
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
			},

			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader'
				]
			}
		]
	}
};