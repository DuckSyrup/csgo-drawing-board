// # utils

// ## Main render function
// Takes the request and response objects as well as the jade page to load and options, which will include any errors.

exports.render = function(req, res, page, options) {
	if (!options) options = {};
	// Error handling
	if (options.error) {
		if (options.error.length == 0)
			delete options.error;
	}
	// Message handling
	if (options.message) {
		if (options.message.length == 0)
			delete options.message;
	}
	// Pass on session data
	if (req.user && req.user.name)
		options.currUser = req.user.name;
	// Render the page
	res.render(page, options);
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