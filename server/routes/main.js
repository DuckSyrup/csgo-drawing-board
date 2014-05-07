module.exports = function(app,utils) {
	//Main page
	app.get('/', function(req,res) {
		utils.render(req, res, 'index');
	});
}