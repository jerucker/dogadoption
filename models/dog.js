var orm = require("../config/orm");

var dog = {
  allGoodDogs: function(callback) {
    let query = {
      table: "dogs",
      where: [{ is_adopted: false }]
    };
    orm.select(query, callback);
  },

  insertDog: function(newDog, callback) {
    let query = {
      table: "dogs",
      data: newDog
      // debug: true
    };
    orm.insert(query, callback);
  },

  dogById: function(id, callback) {
    let query = {
      table: "dogs",
      where: [{ dog_id: id }]
    };
    orm.select(query, callback);
  },
  //jimmy contribution
  //   dogByOwner: function(owner, callback) {
  //     let query = {
  //       table: "dogs",
  //       where: [{ owner_name: owner }]
  //     };
  //     orm.select(query, callback);
  //   },

  adoptDog: function(dog_id, callback) {
    let query = {
      table: "dogs",
      data: { is_adopted: true },
      where: [{ dog_id: dog_id }],
      debug: true
    };
    orm.update(query, callback);
  }
};

module.exports = dog;
