var mongoose = require('mongoose');

var db = mongoose.connection;

db.on('error', console.error);

function Db(username,pass) {
    var userSchema = new mongoose.Schema({
        steamID: String,
        username: String
    });
    
    var stratSchema = new mongoose.Schema({
        stratName: String,
        stratDescription: String,
        username: String,
        map: String,
        shapes: [Object]
    });
    
    var User = mongoose.model('User', userSchema);
    var Strat = mongoose.model('Strat', stratSchema);
    
    this.newUser = function(obj, cb) {
        if (obj.steamID && obj.username) {
            var usr = new User({
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
    
    this.newStrat = function(obj, cb) {
        if (obj.stratName && obj.username && obj.map) {
            var strat = new Strat({
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
    
    this.findUser = function(username, cb) {
        User.findOne({username:username}, function(err,user){
            cb(err,user);
        });
    }
    
    this.findUserBySteamId = function(steamID, cb) {
        User.findOne({steamID:steamID}, function(err,user){
            cb(err,user);
        });
    }
    
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
    
    this.findUserStrats = function(username, cb) {
        Strat.find({username:username}, function(err,strats){
            cb(err,strats);
        });
    }
    console.log('user: ' + username + ', pass: ' + pass);
    mongoose.connect('mongodb://'+username+':'+pass+'@ds039707.mongolab.com:39707/csgo');
}


exports.db = function(user,pass){
    return new Db(user,pass);
}

//function Test(one,two){
//    this.one = one;
//    this.two = two;
//}
//
//exports.test = function(one,two){
//    return new Test(one,two);
//}