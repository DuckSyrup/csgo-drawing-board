// # index

module.exports = function(app,db,passport,utils) {
	
	// ## Main routes
	require('./main')(app,utils);
	
	// ## Auth routes
	require('./auth')(app,db,passport);
	
	// ## API routes
	require('./api')(app,db);
	
	// ## User routes
	require('./user')(app,db,utils);
	
	// ## Strat routes
	require('./strat')(app,db,utils);
	
	// ## Frame routes
	require('./frame')(app,db,utils);
}

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