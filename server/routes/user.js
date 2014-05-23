// # user

module.exports = function(app,db,utils) {
	// ## Sign up
	app.get('/signup', function(req,res) {
		utils.render(req, res, 'signup', {error: req.flash('error')});
	});
	
	// ## Process the signup
	app.post('/signup/init', function(req,res) {
		var newUser= {
			name: req.body.name,
			steamID: req.user.id
		};
		db.newUser(newUser, function(err, user) {
			if (err) {
				req.flash('error', err.err);
				res.redirect('/signup');
			} else {
				req.user.name = newUser.username;
				res.redirect('/u/' + req.user.name);
			}
		});
	});
	
	
	// ## View a user
	app.get('/:userType(u|user)/:user', function(req,res) {
		db.findUser({name: req.params.user}, function(err, user) {
			if (user) {
				db.findUserStrats({name:req.params.user, cat:'user'}, function(err, strats) {
					utils.render(req, res, 'user', {error: err, user: req.params.user, strats:strats});
				});
			} else {
				utils.render(req, res, 'user', {error: 'User ould not be found.', user: req.params.user});
			}
		});
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