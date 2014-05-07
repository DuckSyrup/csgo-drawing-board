module.exports = function(app,db,passport) {
	//Login through Steam
	app.get('/auth/steam',
		passport.authenticate('steam', {failureRedirect: '/'}),
		function(req,res) {
			res.redirect('/');
		}
	);
	
	//Complete Steam login
	app.get('/auth/steam/return',
		passport.authenticate('steam', {failureRedirect: '/'}),
		function(req, res) {
			db.findUserBySteamId(req.user.id, function(err,user){
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