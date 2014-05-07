exports.render = function(req, res, page, options) {
	if (!options) options = {};
	//Handle dumb flash issues
	if (options.error) {
		if (options.error.length == 0)
			delete options.error;
	}
	if (options.message) {
		if (options.message.length == 0)
			delete options.message;
	}
	if (req.user && req.user.name)
		options.currUser = req.user.name;
	res.render(page, options);
}