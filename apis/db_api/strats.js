// # strats
function Db(username,pass,Strat,Frame) {
    // ## Creates a new strat
    this.newStrat = function(obj, cb) {
        if (obj.name && obj.owner.name && obj.owner.cat && obj.map && obj.title) {
            var strat = new Strat({
                name: obj.name,
                title: obj.title,
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
        } else {
            cb('must include username, stratName, and map', null);
        }
    }
    
    // ## Find strat
    // Find by username and strat name
    this.findStrat = function(obj, cb){
        if (obj.name && obj.owner.name && obj.owner.cat) {
            Strat.findOne({name:obj.name, 'owner.name':obj.owner.name, 'owner.cat':obj.owner.cat}, function(err,strat){
                cb(err,strat);
            });
        } else {
            cb('must provide stratName and owner.name and owner.cat',null);
        }
    }
    
    // ## Finds all user strats
    this.findUserStrats = function(obj, cb) {
        if (obj.name && obj.cat) {
            Strat.find({'owner.name':obj.name, 'owner.cat':obj.cat}, function(err,strats){
                cb(err,strats);
            });
        } else {
            cb("must provide name and cat", null);
        }
    }
    
    // ## Removes a strat and all frames attached to that strat
    this.removeStrat = function(obj, cb) {
        var errCat = "";
        if (obj.owner.name && obj.owner.cat && obj.stratName) {
            Frame.remove({strat:obj.stratName}, function(err){
                errCat += err;
                Strat.remove({owner: obj.owner, stratName: obj.stratName}, function(err){
                    errCat += err;
                    cb(errCat);
                });
            });
        }
    }
}

exports.db = function(user,pass,Strat,Frame){
    return new Db(user,pass,Strat,Frame);
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