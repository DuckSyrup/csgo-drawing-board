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

var passport = require('passport'),
    SteamStrategy = require('passport-steam').Strategy,
    db = require('./db_api').db,
    connect = require('connect');
    cookieParser = require('cookie-parser'),
    session = require('express-session');

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

//We use www as the containing folder for all front-facing webserver files
app.use(express.static(__dirname + '/www/public'));
app.set('views', __dirname + '/www/views');
app.set('view engine', 'jade');

//Middleware to use POSTs
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({secret:'this is super secret'}));
app.use(passport.initialize());
app.use(passport.session());

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
                req.user.test = 'this is a test';
                res.redirect('/u/'+user.username);
            }
            else {
                req.user.test = 'this is another test';
                console.log('blah: ' + req.user.test);
                res.redirect('/newuser');
            }
        });
    }
);

app.get('/newuser', function(req,res){
    console.log('test: ' + req.user.test);
    res.render('newuser');
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
    res.render('create');
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