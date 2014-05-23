var nconf = require('nconf');
nconf.argv().file('../config.json');
nconf.defaults({
	ip: 'localhost',
	port: 8080,
	dbuser: "user",
	dbpass: "pass",
	session: "secret"
});

console.log(nconf.get('dbuser'));
var db = require('../apis/db_api').db(nconf.get('dbuser'), nconf.get('dbpass'));

//db.newStrat({
//        stratName: "test",
//        owner: {
//            cat: "user",
//            name: "bob"
//        },
//        map: "dust2"
//    }, function(err, strat){
//        console.log("fart: " + JSON.stringify(strat));
//    });

db.removeStrat({
        stratName: "test",
        owner: {
            cat: "user",
            name: "bob"
        }
    }, function(err){
        if(!err) {
            console.log('done');
        }
        else {
            console.log('error: ' + err);
        }
    });