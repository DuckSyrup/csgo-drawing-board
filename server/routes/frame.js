// # frame
// Handle all routes relating to frames

module.exports = function(app,db,utils) {	
	// ## Edit a strategy
	// This will load the editor page
	app.get('/:userType(u|user)/:user/:stratType(s|strat|strategy)/:strat/:frameType(f|frame)/:frame', function(req,res) {
		if (req.params.user && req.params.strat && req.params.frame) {
			utils.render(req, res, 'frame'); // Stub because frame db stuff isn't up yet
		}
	});
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