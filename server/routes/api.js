// # server routes api
// Handle all API requests.

module.exports = function(app, db) {
	// ## Get a user
	// Does not return strats.
	app.get('/api/:type(u|user)/:user', function(req,res) {
		db.findUser(req.params.user, function(err, user) {
			if (user) {
				// If the user that was passed exists, pass back info.
				res.json({exists: true, error: err, user:user.name});
			} else {
				// Otherwise, pass back an error.
				res.json({exists: false, error: err, user:req.params.user});
			}
		});
	});
	
	// ## Delete a user strat
	app.get('/api/:type(u|user)/:user/:strat/delete', function(req,res) {
		if (req.user && req.user.name && req.user.name == req.params.user) {
			// If the user trying to delete is an authorized user, delete the strat.
			// This is not currently implemented.
			res.json({worked: true, error: null, strat: req.params.strat, user:req.params.user});
		} else {
			// Otherwise, return an error that you are not logged in.
			res.json({worked: false, error: "You aren't logged in.", strat: req.params.strat, user:req.params.user});
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