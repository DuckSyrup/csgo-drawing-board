var mongoose = require('mongoose');

var db = mongoose.connection;

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
    
    var Strat = mongoose.model('Strat', stratSchema);

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
    
    //Finds all strategies by a user
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
    
    //Removes a strat and all of it's frames
    this.removeStrat = function(obj, cb) {
        
    }
    
    //Edit display name for strat
    this.editStratDisplayName = function(obj, cb) {
        if (obj.stratName && obj.owner.cat && obj.owner.name && obj.displayName) {
            Strat.update({stratName: obj.stratName, 'owner.cat': owner.cat, 'owner.name': owner.name}, {displayName: obj.displayName}, function(err, strat){
                cb(err, strat);
            });
        }
        else {
            cb("must provide strat name owner.cat and owner.name", null);
        }
    }
    
    
    
    
    mongoose.connect('mongodb://'+username+':'+pass+'@ds047207.mongolab.com:47207/csgodb');
}

exports.db = function(user,pass){
    return new Db(user,pass);
}