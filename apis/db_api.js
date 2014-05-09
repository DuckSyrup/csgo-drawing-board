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
var db_users = require('./db_users').db;

var db = mongoose.connection;

db.on('error', console.error);

function Db(username,pass) {
    
    //Schema for a strat
    var stratSchema = new mongoose.Schema({
        stratName: String,
        desc: String,
        owner: {
            cat: String, //Category
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
    
    var Strat = mongoose.model('Strat', stratSchema);
    var Frame = mongoose.model('Frame', frameSchema);
    
    //Creates a new user entry into db
    this.newUser = db_users.newUser;
    
    //Creates a new strategy entry into db
    this.newStrat = function(obj, cb) {
        if (obj.stratName && obj.owner.name && obj.owner.cat && obj.map) {
            var strat = new Strat({
                stratName: obj.stratName,
                owner: obj.owner,
                desc: obj.desc,
                map: obj.map,
                root: ""
            });
            strat.save(function(err, strat){
                var id = strat._id;
                var rootFrame = new Frame({
                    desc: obj.desc || "",
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
    this.findUser = db_users.findUser;
    
    //Find user by steam ID
    this.findUserBySteamId = db.users.findUserBySteamId;
    
    //Find strat by username and strat name
    this.findStrat = function(obj, cb){
        if (obj.stratName && obj.owner.name && obj.owner.cat) {
            Strat.findOne({stratName:obj.stratName, 'owner.name':obj.owner.name, 'owner.cat':obj.owner.cat}, function(err,strat){
                cb(err,strat);
            });
        }
        else {
            cb('must provide stratName and owner.name and owner.cat',null);
        }
    }
    
    //Finds all strategies by a user.
    this.findUserStrats = function(obj, cb) {
        if (obj.name && obj.cat) {
            Strat.find({'owner.name':obj.name, 'owner.cat':obj.cat}, function(err,strats){
                cb(err,strats);
            });
        }
        else {
            cb("must provide name and cat", null);
        }
        
    }
    
    //Delete frame from strat. First checks to make sure no one is currently editing any of the child frames and then deletes a the frame and all of children.
    this.deleteFrame = function(obj, cb) {
        if (checkChildren(obj.strat, obj.frame)) {
            
        }
    }
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