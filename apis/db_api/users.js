// # users
function Db(username,pass,User) {
    // ## Creates a new user
    this.newUser = function(obj, cb) {
        if (obj.steamID && obj.username) {
            var usr = new User({
                steamID: obj.steamID,
                name: obj.username,
                displayName: obj.username
            });
            usr.save(function(err, user){
                cb(err, user);
            });
        } else {
            cb('must include username and steamID', null);
        }
    }
    
    // ## Find user -- name
    // Finds by username
    this.findUser = function(obj, cb) {
        if (obj.username) {
            User.findOne({name:obj.username}, function(err,user){
                cb(err,user);
            });
        } else {
            cb("must provide username", null);
        }
        
    }
    
    // ## Find user -- ID
    // Finds by SteamID
    this.findUserBySteamId = function(obj, cb) {
        if (obj.steamID) {
            User.findOne({steamID:obj.steamID}, function(err,user){
                cb(err,user);
            });
        } else {
            cb("must provide steamID", null);
        }
        
    }
    
    // ## Edit user name
    // Edits the user's display name
    this.editUserDisplayName = function(obj, cb) {
        if (obj.displayName && obj.name) {
            User.update({name:obj.name}, {displayName:obj.displayName}, function(err,user){
                cb(err,user);
            });
        }
    }
    
    // ## Find user details
    // Finds given fields in user
    this.findInUser = function(obj, cb) {
        if (obj.params && obj.name) {
            var paramString = obj.params.join(' ');
            User.find({name:obj.name}, paramString, function(err, user){
                cb(err, user);
            });
        }
    }
}

exports.db = function(user,pass,User){
    return new Db(user,pass,User);
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