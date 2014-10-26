var database = require("../database/mssql_journalx");
var examineDB = {};

/**
 * 获取待审核的文章
 * @param uid
 * @param callback
 */
examineDB.getAllExamArts = function (uid, callback) {
    //TODO
    database.query("", callback);
};

/**
 * 评审某篇文章
 * @param aid
 * @param uid
 * @param exam
 * @param msg
 * @param callback
 */
examineDB.examine = function (aid, uid, exam, msg, callback) {
    //TODO
    database.query("", callback);
};

/**
 * 指定审稿人
 * @param uid
 * @param tid
 * @param aid
 * @param callback
 */
examineDB.send = function (uid, tid, aid, callback) {
    //TODO
    database.query("", callback);
};

/**
 * 获取审稿历史
 * @param aid
 * @param callback
 */
examineDB.examHistory = function (aid, callback) {
    //TODO
    database.query("", callback);
};

/**
 * 根据主编获取对应的审稿人信息
 * @param uid
 * @param callback
 */
examineDB.getExaminerList = function (uid, callback) {
    //TODO
    database.query("", callback);
};

/**
 * 根据ID获取某篇文章的信息
 * @param aid
 * @param callback
 */
examineDB.getById = function (aid, callback) {
    //TODO
    database.query("", callback);
};


module.exports = examineDB;