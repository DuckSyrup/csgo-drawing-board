/*
 * Copyright 2014 Duck Syrup
 *
 * This file is part of CS:GO Drawing Board.
 *
 * CS:GO Drawing Board is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * CS:GO Drawing Board is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with CS:GO Drawing Board.  If not, see <http://www.gnu.org/licenses/>.
*/

var mongoose = require('mongoose');

var db = mongoose.connection;

db.on('error', console.error);

function Db(username,pass) {
    //Schema for a user
    var userSchema = new mongoose.Schema({
        id: String,
        name: String
    });
    
    //Schema for a strat
    var stratSchema = new mongoose.Schema({
        stratName: String,
        stratDescription: String,
        username: String,
        map: String,
        shapes: [Object]
    });
    
    var Users = mongoose.model('users', userSchema);
    var Strats = mongoose.model('strats', stratSchema);
    
    //Creates a new user entry into db
    this.newUser = function(obj, cb) {
        if (obj.steamID && obj.username) {
            var usr = new Users({
                steamID: obj.steamID,
                username: obj.username
            });
            usr.save(function(err, user){
                cb(err, user);
            });
        }
        else {
            cb('must include username and steamID', null);
        }
    }
    
    //Creates a new strategy entry into db
    this.newStrat = function(obj, cb) {
        if (obj.stratName && obj.username && obj.map) {
            var strat = new Strats({
                stratName: obj.stratName,
                username: obj.username,
                stratDescription: obj.stratDescription,
                map: obj.map,
                shapes: obj.shapes
            });
            strat.save(function(err, strat){
                cb(err, strat);
            });
        }
        else {
            cb('must include username, stratName, and map', null);
        }
    }
    
    //Finds user by username
    this.findUser = function(username, cb) {
        Users.findOne({username:username}, function(err,user){
            cb(err,user);
        });
    }
    
    //Find user by steam ID
    this.findUserBySteamId = function(steamID, cb) {
        Users.findOne({steamID:steamID}, function(err,user){
            cb(err,user);
        });
    }
    
    //Find strat by username and strat name
    this.findStrat = function(obj, cb){
        if (obj.stratName && obj.username) {
            Strats.findOne({stratName:obj.stratName, username:obj.username}, function(err,strat){
                cb(err,strat);
            });
        }
        else {
            cb('must provide stratName and username',null);
        }
    }
    
    //Finds all strategies by a user.
    this.findUserStrats = function(username, cb) {
        Strats.find({username:username}, function(err,strats){
            cb(err,strats);
        });
    }
    mongoose.connect('mongodb://'+username+':'+pass+'@ds047207.mongolab.com:47207/csgodb');
}


exports.db = function(user,pass){
    return new Db(user,pass);
}