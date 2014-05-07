module.exports = function(app,db,utils) {
	//Sign up
	app.get('/signup', function(req,res) {
		utils.render(req, res, 'signup', {error: req.flash('error')});
	});
	
	//Process the signup
	app.post('/signup/init', function(req,res) {
		var newUser= {
			username: req.body.name,
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
	
	
	//View a user
	app.get('/:type(u|user)/:user', function(req,res) {
		db.findUser(req.params.user, function(err, user) {
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