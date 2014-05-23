// # strat
// Handle all routes relating to strategies

module.exports = function(app,db,utils) {
	// ## Create a strategy
	app.get('/create', function(req,res) {
		if (req.user && req.user.name)
			utils.render(req, res, 'create', {error: req.flash('error')});
		else
			utils.render(req, res, 'create', {error: 'You are not logged in.'});
	});
	
	// ## Finalizing strategy creation
	app.post('/create/init', function(req,res) {
		if (req.body.name && req.body.map && req.user && req.user.name) {
			var desc;
			req.body.desc ? desc = req.body.desc : desc = '';
			var newStrat = {
				stratName: req.body.name,
				owner: {name: req.user.name, cat: 'user'},
				map: req.body.map,
				desc: desc
			};
			db.newStrat(newStrat, function(err, strat){
				if (err) {
					req.flash('error', err);
					res.redirect('/create');
				}
				else {
					res.redirect('/u/' + req.user.name + '/' + req.body.name);
				}
			});
		} else {
			if (!req.body.name)
				req.flash('error', 'No strategy name provided.  Try again.');
			else if (!req.body.map)
				req.flash('error', 'No map provided.  Try again.');
			else if (!req.user || !req.user.name)
				req.flash('error', 'You are not logged in.  Log in and try again.');
			else
				req.flash('error', 'Unknown error.  Try again.');
			res.redirect('/create');
		}
	});
	
	// ## Edit a strategy
	app.get('/:userType(u|user)/:user/:stratType(s|strat|strategy)/:strat', function(req,res) {
		utils.render(req, res, 'editor');
	});
	
	// ## Delete a strategy
	// This will probably be replaced by the API.
	app.get('/:userType(u|user)/:user/:stratType(s|strat|strategy)/:strat/delete', function(req,res) {
		res.send('delete');
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