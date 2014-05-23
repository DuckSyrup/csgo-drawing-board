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
	io = require('./apis/socket_io_api');

// ## Read config

// We use nconf to read configuration options.  Command line arguments override config file options which override default options.
nconf.argv().file('./config.json');
nconf.defaults({
	ip: 'localhost',
	port: 8080,
	dbuser: "user",
	dbpass: "pass",
	session: "secret"
});

// Read configuration files into global variables.
var ip = nconf.get('ip');
var port = nconf.get('port');
var dbUser = nconf.get('dbuser');
var dbPass = nconf.get('dbpass');
var sessionSecret = nconf.get('session');

// ## Server config

// Connect the database using the db username and password that we got from the config.
var db = require('./apis/db_api').db(dbUser,dbPass);

// We use www as the containing folder for all front-facing webserver files.
app.use(express.static(__dirname + '/www/public'));
app.set('views', __dirname + '/www/views');
// We use jade as the layout/templating engine.
app.set('view engine', 'jade');
app.use(function(req, res, next) {
	app.locals.pretty = true;
	next();
});

// ### Middleware initialization

// Middleware to use POSTs.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
// Cookie parsing middleware.
app.use(cookieParser());
// Session middleware.
app.use(session({secret:sessionSecret}));
// Passport init--we use it for Steam authentication.
app.use(passport.initialize());
app.use(passport.session());
// Flash middleware.
app.use(flash());

// ### Passport config

passport.serializeUser(function(user, done){
	done(null, user);
});

passport.deserializeUser(function(obj,done){
	done(null, obj);
});

passport.use(new SteamStrategy({
		returnURL: 'http://' + ip + ':' + port + '/auth/steam/return',
		realm: 'http://' + ip + ':' + port + '/',
	}, function(identifier, profile, done) {
		process.nextTick(function() {
			var id = identifier.match('http://steamcommunity.com/openid/id/(.*)')[1];
			profile.id = id;
			return done(null, profile);
		});
	}
));

// ### Initialize routes

// We initialize routes using submodules.
require('./server/')(app,db,passport);

// #### 404 handling
app.use(function(req, res, next){
	res.status(404);
	
	// If they accept HTML pages, render an HTML 404 page.
	if (req.accepts('html')) {
		res.render('404');
		return;
	}
	
	// If they accept JSON, return a JSON object.
	if (req.accepts('json')) {
		res.json({ error: '404 - Not found' });
		return;
	}
	
	// Default to plain text.
	res.type('txt').send('Not found');
});

// ## Server start

// Log configuration options to console along with status updates.
console.log('Listening on ' + ip + ':' + port);
console.log('Session secret is ' + sessionSecret);
console.log('Using DB username-password of ' + dbUser + '-' + dbPass);

// Start the webserver.
var server = app.listen(port, ip);
// Start socket.io.
io.start(server);

//CS:GO Drawing Board is a web application that allows users to develop CS:GO strategies.
//
//Copyright 2014 Duck Syrup
//
//This file is part of CS:GO Drawing Board.
//
//CS:GO Drawing Board is free software: you can redistribute it and/or modify
//it under the terms of the GNU Affero General Public License as published by
//the Free Software Foundation, either version 3 of the License, or
//(at your option) any later version.
//
//CS:GO Drawing Board is distributed in the hope that it will be useful,
//but WITHOUT ANY WARRANTY; without even the implied warranty of
//MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//GNU Affero General Public License for more details.
//
//You should have received a copy of the GNU Affero General Public License
//along with CS:GO Drawing Board.  If not, see <http://www.gnu.org/licenses/>.