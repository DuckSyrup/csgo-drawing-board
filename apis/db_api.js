// # db api

// ## Load dependencies
var mongoose = require('mongoose');

var db = mongoose.connection;

db.on('error', console.error);

function Db(username,pass) {
    
    // ## Schema for a frame of a strat
    var frameSchema = new mongoose.Schema({
        desc: String,
        event: {
            desc: String,
            icon: String
        },
        elem: [Object],
        parent: String,
        children: [String],
        editors: [String],
        strat: String
    });
    
    // ## Schema for a strat
    var stratSchema = new mongoose.Schema({
        name: String,
        title: String,
        desc: String,
        owner: {
            // Category
            cat: String,
            name: String
        },
        map: String,
        root: String
    });
    
    // ## Schema for a user
    var userSchema = new mongoose.Schema({
        steamID: String,
        name: String,
        title: String
    });
    
    // ## Schema for an organization
    var orgSchema = new mongoose.Schema({
        name: String,
        title: String,
        admins: [String],
        editors: [String]
    });

    var Frame = mongoose.model('Frame', frameSchema);
    var Org = mongoose.model('Org', orgSchema);
    var Strat = mongoose.model('Strat', stratSchema);
    var User = mongoose.model('User', userSchema);
    
    var db_users = require('./db_api/users').db(username,pass,User);
    var db_strats = require('./db_api/strats').db(username,pass,Strat,Frame);

    // ## DB Functions
    
    // Creates a new user entry into db.
    this.newUser = db_users.newUser;
    
    // Edits a user's display name.
    this.editUserDisplayName = db_users.editUserDisplayName;
    
    // Find given fields in User.
    this.findInUser = db_users.findInUser;
    
    // Creates a new strategy entry into db.
    this.newStrat = db_strats.newStrat;
    
    // Finds user by username.
    this.findUser = db_users.findUser;
    
    // Find user by steam ID.
    this.findUserBySteamId = db_users.findUserBySteamId;
    
    // Find strat by username and strat name.
    this.findStrat = db_strats.findStrat;
    
    // Finds all strategies by a user.
    this.findUserStrats = db_strats.findUserStrats;
    
    this.removeStrat = db_strats.removeStrat;
    
    // Delete frame from strat. First checks to make sure no one is currently editing any of the child frames and then deletes a the frame and all of children.
    this.deleteFrame = function(obj, cb) {
        if (checkChildren(obj.strat, obj.frame)) {
            
        }
    }
    
    // Check to find children.
    var checkChildren = function(obj) {
        Frame.findOne({strat: obj.strat, _id: obj.frame}, function(err, frame){
            var children = frame.children;
            
            children.forEach(function(e, i, a){
                
            });
        });
    }
    mongoose.connect('mongodb://'+username+':'+pass+'@ds047207.mongolab.com:47207/csgodb');
}


exports.db = function(user,pass){
    return new Db(user,pass);
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
