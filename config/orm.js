let connection = require("./connection");

let orm = {
  select: function(query, callback) {
    let queryString = "SELECT ?? FROM ??";
    let searchCriteria = [query.columns || ["*"], query.table];
    if (query.where) {
      queryString = orm._buildWhereStatement(
        query,
        queryString,
        searchCriteria
      );
    }
    let statement = connection.query(queryString, searchCriteria, function(
      error,
      result
    ) {
      callback(error, result);
    });
    if (query.debug) {
      console.log(statement.sql);
    }
  },
  _buildWhereStatement: function(query, queryString, searchCriteria) {
    queryString += " WHERE ";
    let whereString = [];
    for (let where in query.where) {
      searchCriteria.push(query.where[where]);
      whereString.push(" ? ");
    }
    let operator = query.operator || "AND";
    queryString += whereString.join(operator);
    return queryString;
  },
  insert: function(query, callback) {
    let queryString = "INSERT INTO ?? SET ?";
    let statement = connection.query(
      queryString,
      [query.table, query.data],
      function(error, result) {
        callback(error, result);
      }
    );
    if (query.debug) {
      console.log(statement.sql);
    }
  },
  update: function(query, callback) {
    let queryString = "UPDATE ?? SET ? WHERE ?";
    let statement = connection.query(
      queryString,
      [query.table, query.data, query.where[0]],
      function(error, result) {
        callback(error, result);
      }
    );
    if (query.debug) {
      console.log(statement.sql);
    }
  },
  delete: function(query, callback) {
    let queryString = "DELETE FROM ?? WHERE ?";
    let statement = connection.query(
      queryString,
      [query.table, query.where[0]],
      function(error, result) {
        callback(error, result);
      }
    );
    if (query.debug) {
      console.log(statement.sql);
    }
  },
  query: function(queryString, queryArray, callback) {
    connection.query(queryString, queryArray, function(error, result) {
      callback(error, result);
    });
  },

  getUserFavorites: function(user_id, callback) {
    let queryString =
      "Select dogs.dog_id, favorites.fav_id, dog_blurb, dog_img_url, dog_name, dog_age, owner_name, dog_breed from dogs left join favorites on dogs.dog_id = favorites.dog_id where favorites.user_id = " +
      user_id;
    let statement = connection.query(queryString, function(error, result) {
      callback(error, result);
    });
    console.log(statement.sql);
  }
};

module.exports = orm;
