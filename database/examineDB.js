var database = require("../database/mssql_journalx");
var examineDB = {};

/**
 * 获取待审核的文章
 * @param uid
 * @param callback
 */
examineDB.getAllExamArts = function (uid, callback) {
    //TODO
    database.query("",callback);
};

module.exports = examineDB;