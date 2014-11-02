var database = require("../database/mssql_journalx");
var async = require("async");
var examineDB = {};

/**
 * 获取待审核的文章
 * @param uid 用户的ID
 * @param callback
 */
examineDB.getAllExamArts = function (uid, callback) {
    database.query("select a.manu_id as id, c.review_status as reviewStatus, d.phase_name as phaseName," +
        " a.handler_type as handlerType, deal_status as dealStatus, manu_status as manuStatus," +
        " participant_name as name" +
        " from person_reviewer a, participant b, manuflow c, review_phase d" +
        " where c.flow_id=a.flow_id and d.phase_id = a.phase_id and a.participant_id = b.participant_id" +
        " and a.participant_id = " +
        uid + " order by a.manu_id desc, a.flow_id asc", callback);
};

/**
 * 更新人员评审信息
 * @param aid 文章ID
 * @param uid 用户ID
 * @param exam 评审结果
 * @param msg  评审意见
 * @param callback
 */
examineDB.updatePersonReviewer = function (aid, uid, exam, msg, callback) {
    database.query("", callback);
};

/**
 * 更新评审流程表
 * @param aid
 * @param uid
 * @param exam
 * @param msg
 * @param isCE
 * @param callback
 */
examineDB.updateManuFlow = function (aid, uid, exam, msg, isCE, callback) {
    database.query("", callback);
};

/**
 * 更新审稿结论表
 * @param magid
 * @param aid
 * @param uid
 * @param msg
 * @param callback
 */
examineDB.updateManuConclusion = function (magid, aid, uid, msg, callback) {
    database.query("", callback);
};

/**
 * 更新审稿日志
 * @param magid
 * @param title
 * @param submitterid
 * @param handlerid
 * @param content
 * @param ps
 * @param callback
 */
examineDB.updateManuscriptLog = function (magid, title, submitterid, handlerid, content, ps, callback) {
    database.query("", callback);
};

/**
 * 获取推荐专家
 * @param manuid
 * @param callback
 */
examineDB.getManuscriptReviewer = function (manuid, callback) {
    database.query("", callback);
};

/**
 * 更新邮件表
 * @param aid
 * @param uid
 * @param exam
 * @param msg
 * @param callback
 */
examineDB.updateEmail = function (aid, uid, exam, msg, callback) {
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