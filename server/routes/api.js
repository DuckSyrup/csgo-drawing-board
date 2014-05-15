module.exports = function(app, db) {
	//Get a user.  Does not return strats.
	app.get('/api/:type(u|user)/:user', function(req,res) {
		db.findUser(req.params.user, function(err, user) {
			if (user) {
				res.json({exists: true, error: err, user:user.name});
			} else {
				res.json({exists: false, error: err, user:req.params.user});
			}
		});
	});
	
	//Delete a user strat
	app.get('/api/:type(u|user)/:user/:strat/delete', function(req,res) {
		if (req.user && req.user.name && req.user.name == req.params.user) {
			//Delete strat
			res.json({worked: true, error: null, strat: req.params.strat, user:req.params.user});
		} else {
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