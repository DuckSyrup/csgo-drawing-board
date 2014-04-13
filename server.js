/*
 * Copyright 2014 Duck Syrup
 *
 * This file is part of CS:GO Drawing Board.
 *
 * CS:GO Drawing Board is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * CS:GO Drawing Board is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with CS:GO Drawing Board.  If not, see <http://www.gnu.org/licenses/>.
*/

var express = require('express');
app = express();

//We use www as the containing folder for all front-facing webserver files
app.use(express.static(__dirname + '/www/public'))
app.set('views', __dirname + '/www/views');
app.set('view engine', 'jade');

//Middleware to use POSTs
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

var url = require('url');
var nconf = require('nconf');
var fs = require('fs');

var db; //We load in DB later, after we've learned the username and password from the options

/*---------------
ROUTES
---------------*/

app.get('/', function(req,res) {
	res.render('index');
});

//Sign up
app.get('/signup', function(req,res) {
	res.render('signup');
});

//Login
app.get('/login', function(req,res) {
	res.render('login');
});

//Create a strategy
app.get('/create', function(req,res) {
	res.render('create', {error: req.params.error});
});

//Create a strategy and load it into the DB
app.post('/init', function(req,res) {
	if (req.body.name && req.body.map) {
		var newStrat = {
			stratName: req.body.name,
			//username: req.user.username,
			map: req.body.map
		};
		res.redirect('/u/' + req.user.name + '/' + req.body.name);
	} else {
		if (!req.body.name) {
			console.log('name');
			res.redirect('/create');
		}
		if (!req.body.map) {
			console.log('map');
			res.redirect('/create');
		}
		res.send('hi');
	}
});

//View a user
app.get('/:type(u|user)/:user', function(req,res) {
	db.findUserStrats(req.params.username, function(err, strats) {
		console.log(strats);
		res.render('user', {error: err, user: req.params.user, strats:strats});
	});
});

//Edit a strategy
app.get('/:type(u|user)/:user/:strat', function(req,res) {
	res.render('editor');
});

//404 handling
app.use(function(req, res, next){
	res.status(404);
	
	// respond with html page
	if (req.accepts('html')) {
		res.render('404');
		return;
	}
	
	// respond with json
	if (req.accepts('json')) {
		res.json({ error: '404 - Not found' });
		return;
	}
	
	// default to plain-text. send()
	res.type('txt').send('Not found');
});

/*---------------
SERVER CONFIG AND START
---------------*/

nconf.argv().file('./config.json');
nconf.defaults({
	ip: 'localhost',
	port: 8080,
	dbuser: "user",
	dbpass: "pass"
});

var ip = nconf.get('ip');
var port = nconf.get('port');
var dbuser = nconf.get('dbuser');
var dbpass = nconf.get('dbpass');

console.log('Listening on ' + ip + ':' + port);
console.log('Using DB username-password of ' + dbuser + '-' + dbpass);
db = require('./db_api').db(dbuser,dbpass);
app.listen(port, ip);