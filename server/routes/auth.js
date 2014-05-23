// # auth
// Handle all authorization of users through Steam.

module.exports = function(app,db,passport) {
	// ## Login through Steam
	app.get('/auth/steam',
		passport.authenticate('steam', {failureRedirect: '/'}),
		function(req,res) {
			res.redirect('/');
		}
	);
	
	// ## Complete Steam login
	app.get('/auth/steam/return',
		passport.authenticate('steam', {failureRedirect: '/'}),
		function(req, res) {
			db.findUserBySteamId({steamID: req.user.id}, function(err,user){
				if (user) {
					req.user.name = user.name;
					res.redirect('/u/'+user.name);
				}
				else {
					res.redirect('/signup');
				}
			});
		}
	);
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