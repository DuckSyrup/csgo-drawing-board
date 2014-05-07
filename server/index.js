module.exports = function(app,db,passport) {
	var utils = require('./utils');

	require('./routes')(app,db,passport,utils);
}