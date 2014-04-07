var express = require('express');
app = express();

//We use www as the containing folder for all front-facing webserver files
app.use(express.static(__dirname + '/www/public'))
app.set('views', __dirname + '/www/views');
app.set('view engine', 'jade');
//app.use(express.favicon(__dirname + '/www/public/images/.ico'));

//Middleware to use POSTs
app.use(express.json());
app.use(express.urlencoded());

var url = require('url');
var argv = require('optimist').argv; //Command line parsing--allows lookups for flags
var fs = require('fs');

var db; //We load in DB later, after we've learned the username and password from the options

//Loads config file if one exists and then starts the server
var config_path = './config.json';
fs.exists(config_path, function (config_exists) {
	var config;
	if (config_exists) {
		config = require(config_path);
	} else { //No config file--logs it to console and lets the server start with command line args or defaults
		console.log('No config file provided.');
		config = false;
	}
	startServer(config);
});

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
	res.render('create');
});

//View a user
app.get('/:type(u|user)/:user', function(req,res) {
	db.findUserStrats(req.params.username, function(err, strats) {
        console.log(req.params.user);
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



//Start the server.  Called AFTER the file system attempts to find config.json.  Config file overrides defaults, and command line arguments override config file.
function startServer(config) {
	//Default variables
	var ip = "localhost";
	var port = 8080;
	var dbuser = "";
	var dbpass = "";
	
	//Read from config file, if one is provided.
	if (config) {
		if (config.ip) ip = config.ip;
		if (config.port) port = config.port;
		if (config.dbuser) dbuser = config.dbuser;
		if (config.dbpass) dbpass = config.dbpass;
	}
	
	//Take command line arguments
	if (argv.ip) ip = argv.ip;
	if (argv.port) port = argv.port;
	if (argv.dbuser) dbuser = argv.dbuser;
	if (argv.dbpass) dbpass = argv.dbpass;
	
	console.log('Listening on ' + ip + ':' + port);
	console.log('Using DB username-password of ' + dbuser + '-' + dbpass);
	db = require('./db_api').db(dbuser,dbpass);
	app.listen(port, ip);
}