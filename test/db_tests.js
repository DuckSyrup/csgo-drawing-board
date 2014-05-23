var nconf = require('nconf');
nconf.argv().file('./config.json');
var db = require('./apis/db_api').db(nconf.get('dbuser'), nconf.get('dbpass'));

db.newStrat({
        stratName: "test",
        owner: {
            cat: "user",
            name: "bob"
        },
        map: "dust2"
    }, function(err, strat){
        console.log(JSON.stringify(strat));
});