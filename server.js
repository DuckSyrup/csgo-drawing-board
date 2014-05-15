/*
Copyright 2014 Duck Syrup

This file is part of CS:GO Drawing Board.

CS:GO Drawing Board is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

CS:GO Drawing Board is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with CS:GO Drawing Board.  If not, see <http://www.gnu.org/licenses/>.
*/

// # server
// Main program file--loads all APIs and determines routing.

// ## Load dependencies

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
	fs = require('fs'),
	io = require('./apis/socket_io_api');

// ## Read config

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
var db = require('./apis/db_api').db(dbUser,dbPass);

//We use www as the containing folder for all front-facing webserver files
app.use(express.static(__dirname + '/www/public'));
app.set('views', __dirname + '/www/views');
app.set('view engine', 'jade');
app.use(function(req, res, next) {
	app.locals.pretty = true;
	next();
});

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
	returnURL: 'http://' + ip + ':' + port + '/auth/steam/return',//return url here
	realm: 'http://' + ip + ':' + port + '/',
	},
	function(identifier, profile, done) {
		process.nextTick(function() {
			//I guess this is where I put in the query for local user from steam data?
			var id = identifier.match('http://steamcommunity.com/openid/id/(.*)')[1];
			profile.id = id;
			return done(null, profile);
		});
	}
));

//Set up routes
require('./server/')(app,db,passport);

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
SERVER START
---------------*/

console.log('Listening on ' + ip + ':' + port);
console.log('Session secret is ' + sessionSecret);
console.log('Using DB username-password of ' + dbUser + '-' + dbPass);

var server = app.listen(port, ip);
io.start(server);