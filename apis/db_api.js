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
        desc: String,
        owner: {
            type: String,
            name: String
        },
        map: String,
        root: String
    });
    
    //Schema for a frame of a strat
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
    
    //Schema for an organization
    var orgSchema = new mongoose.Schema({
        name: String,
        editors: [Object]
    });
    
    var User = mongoose.model('User', userSchema);
    var Strat = mongoose.model('Strat', stratSchema);
    var Frame = mongoose.model('Frame', frameSchema);
    
    //Creates a new user entry into db
    this.newUser = function(obj, cb) {
        if (obj.steamID && obj.username) {
            var usr = new User({
                id: obj.steamID,
                name: obj.username
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
        if (obj.stratName && obj.owner.name && obj.owner.type && obj.map) {
            var strat = new Strat({
                stratName: obj.stratName,
                owner: obj.owner,
                desc: obj.stratDescription,
                map: obj.map,
                root: ""
            });
            strat.save(function(err, strat){
                var id = strat._id;
                var rootFrame = new Frame({
                    desc: "",
                    event: {
                        desc: "Start of round",
                        icon: ""
                    },
                    parent: null,
                    children: [],
                    editors: [],
                    strat: id
                });
                rootFrame.save(function(err, root){
                    Strat.update({_id: id}, {root: root._id}, {}, cb(err, strat));
                });
            });
        }
        else {
            cb('must include username, stratName, and map', null);
        }
    }
    
    //Finds user by username
    this.findUser = function(username, cb) {
        User.findOne({name:username}, function(err,user){
            cb(err,user);
        });
    }
    
    //Find user by steam ID
    this.findUserBySteamId = function(steamID, cb) {
        User.findOne({steamID:steamID}, function(err,user){
            cb(err,user);
        });
    }
    
    //Find strat by username and strat name
    this.findStrat = function(obj, cb){
        if (obj.stratName && obj.username) {
            Strat.findOne({stratName:obj.stratName, username:obj.username}, function(err,strat){
                cb(err,strat);
            });
        }
        else {
            cb('must provide stratName and username',null);
        }
    }
    
    //Finds all strategies by a user.
    this.findUserStrats = function(username, cb) {
        Strat.find({username:username}, function(err,strats){
            cb(err,strats);
        });
    }
    mongoose.connect('mongodb://'+username+':'+pass+'@ds047207.mongolab.com:47207/csgodb');
}


exports.db = function(user,pass){
    return new Db(user,pass);
}