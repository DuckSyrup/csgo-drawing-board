var mongoose = require('mongoose');

var db = mongoose.connection;

function Db(username,pass) {

    
    mongoose.connect('mongodb://'+username+':'+pass+'@ds047207.mongolab.com:47207/csgodb');

}

exports.db = function(user,pass){
    return new Db(user,pass);
}