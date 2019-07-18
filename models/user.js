var orm = require('../config/orm')

var user = {

    insertUser: function (newUser, callback) {
        let query = {
            table: 'users',
            data: newUser,
            debug: true
        };
        orm.insert(query, callback);
    },
    userByUsername: function(username, callback){
        console.log(username)
        let query = {
            table: 'users',
            where: [{username: username}],
            debug: true
        };
        orm.select(query, callback);
    }
};

module.exports = user;