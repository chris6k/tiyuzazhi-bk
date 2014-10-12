var database = require("../database/mssql_journalx");
var validator = require("validator");

var messageDB = {};

messageDB.getUserInfo(userId, callback) {
    database.query('', callback);
}

module.exports = messageDB;