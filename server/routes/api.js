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