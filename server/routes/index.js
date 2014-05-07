module.exports = function(app,db,passport,utils) {
	
	//Main routes
	require('./main')(app,utils);
	
	//Auth routes
	require('./auth')(app,db,passport);
	
	//API routes
	require('./api')(app,db);
	
	//User routes
	require('./user')(app,db,utils);
	
	//Strat routes
	require('./strat')(app,db,utils);
}