module.exports = function(app,db,utils) {
	//Create a strategy
	app.get('/create', function(req,res) {
		if (req.user && req.user.name)
			utils.render(req, res, 'create', {error: req.flash('error')});
		else
			utils.render(req, res, 'create', {error: 'You are not logged in.'});
	});
	
	//Create a strategy and load it into the DB
	app.post('/create/init', function(req,res) {
		if (req.body.name && req.body.map && req.user && req.user.name) {
			var newStrat = {
				stratName: req.body.name,
				owner: {name: req.user.name, cat: 'user'},
				map: req.body.map,
				desc: ""
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
	
	//Edit a strategy
	app.get('/:type(u|user)/:user/:strat', function(req,res) {
		utils.render(req, res, 'editor');
	});
	
	//Delete a strategy
	app.get('/:type(u|user)/:user/:strat/delete', function(req,res) {
		res.send('delete');
	});
}