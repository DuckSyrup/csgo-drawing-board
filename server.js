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

/*---------------
LOAD DEPENDENCIES
---------------*/

var express = require('express');
app = express();

var passport = require('passport'),
	SteamStrategy = require('passport-steam').Strategy,
	connect = require('connect');
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	flash = require('connect-flash'),
	bodyParser = require('body-parser'),
	url = require('url'),
	nconf = require('nconf'),
	summon = require('express-summon-route'),
	fs = require('fs');

/*---------------
READ CONFIG
---------------*/

//Use nconf to read configuration options.  Command line args override config.json which overrides defaults
nconf.argv().file('./config.json');
nconf.defaults({
	ip: 'localhost',
	port: 8080,
	dbuser: "user",
	dbpass: "pass",
	session: "secret"
});

//Read configuration files into global variables
var ip = nconf.get('ip');
var port = nconf.get('port');
var dbUser = nconf.get('dbuser');
var dbPass = nconf.get('dbpass');
var sessionSecret = nconf.get('session');

/*---------------
SERVER CONFIG
---------------*/

//Connect to database
var db = require('./db_api').db(dbUser,dbPass);

//We use www as the containing folder for all front-facing webserver files
app.use(express.static(__dirname + '/www/public'));
app.set('views', __dirname + '/www/views');
app.set('view engine', 'jade');

//Middleware to use POSTs
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(cookieParser());
app.use(session({secret:sessionSecret}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

/*---------------
PASSPORT CONFIG
---------------*/

passport.serializeUser(function(user, done){
	done(null, user);
});

passport.deserializeUser(function(obj,done){
	done(null, obj);
});

passport.use(new SteamStrategy({
	returnURL: 'http://localhost:8080/auth/steam/return',//return url here
	realm: 'http://localhost:8080/',
	},
	function(identifier, profile, done) {
		process.nextTick(function() {
			//I guess this is where I put in the query for local user from steam data?
			console.log('the identifier is: ' + identifier);
			var id = identifier.match('http://steamcommunity.com/openid/id/(.*)')[1];
			profile.id = id;
			console.log(id);
			return done(null, profile);
		});
	}
));

/*---------------
ROUTES
---------------*/

app.get('/', function(req,res) {
	res.render('index');
});

app.get('/auth/steam',
	passport.authenticate('steam', {failureRedirect: '/'}),
	function(req,res) {
		res.redirect('/');
	}
);

app.get('/auth/steam/return',
	passport.authenticate('steam', { failureRedirect: '/' }),
	function(req, res) {
		db.findUserBySteamId(req.user.id, function(err,user){
			if (user) {
				req.user.name = user.username;
				res.redirect('/u/'+user.username);
			}
			else {
				req.user.test = 'this is another test';
				console.log('blah: ' + req.user.test);
				res.redirect('/signup');
			}
		});
	}
);

//Sign up
app.get('/signup', function(req,res) {
	res.render('signup');
});

app.post('/signup/init', function(req,res) {
	var newUser= {
		username: req.body.name,
		steamID: req.user.id
	};
	db.newUser(newUser, function(err, user) {
		if (err) {
			res.redirect('/signup', {error: "Something bad happened.  Try again."});
		} else {
			req.user.name = newUser.username;
			res.redirect('/u/' + req.user.name);
		}
	});
});

//Create a strategy
app.get('/create', function(req,res) {
	res.render('create', {error: req.flash('error')});
});

//Create a strategy and load it into the DB
app.post('/create/init', function(req,res) {
	if (req.body.name && req.body.map) {
		var newStrat = {
			stratName: req.body.name,
			username: req.user.name,
			map: req.body.map
		};
		res.redirect('/u/' + req.user.name + '/' + req.body.name);
	} else {
		if (!req.body.name)
			req.flash('error', 'No strategy name provided.  Try again.');
		else if (!req.body.map)
			req.flash('error', 'No map provided.  Try again.');
		else
			req.flash('error', 'Unknown error.  Try again.');
		res.redirect('/create');
	}
});

//View a user
app.get('/:type(u|user)/:user', function(req,res) {
	db.findUser(req.params.user, function(err, user) {
		if (user) {
			db.findUserStrats(req.params.user, function(err, strats) {
				res.render('user', {error: err, user: req.params.user, strats:strats});
			});
		} else {
			res.render('user', {error: 'Could not be found.', user: req.params.user});
		}
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
API ROUTES
---------------*/

/*---------------
SERVER START
---------------*/

console.log('Listening on ' + ip + ':' + port);
console.log('Session secret is ' + sessionSecret);
console.log('Using DB username-password of ' + dbUser + '-' + dbPass);
app.listen(port, ip);