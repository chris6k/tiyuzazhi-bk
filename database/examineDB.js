var database = require("../database/mssql_journalx");
var async = require("async");
var examineDB = {};

/**
 * 外审获取待审核的文章
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
        uid + " and reviewStatus = 0 order by a.manu_id desc, a.flow_id asc", callback);
};

/**
 * 获取文章
 * @param uid
 * @param callback
 */
examineDB.getAllArts = function (uid, isMaster, callback) {
    database.query('', callback);
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
    //TODO
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
    //TODO
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
    //TODO
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
    //TODO
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
    //TODO
    database.query("", callback);
};


/**
 * 指定审稿人
 * @param uid
 * @param fid
 * @param aid
 * @param callback
 */
examineDB.send = function (uid, fid, aid, callback) {
    database.query("insert into person_reviewer(participant_id, mag_id, manu_id," +
        " flow_id, phase_id, handler_type, deal_status, manu_status) values (" +
        uid + ",1," + aid + "," + fid + ",9,3,0,0" +
        ")", callback);
};

/**
 * 获取审稿历史
 * @param aid
 * @param callback
 */
examineDB.examHistory = function (aid, callback) {
    database.query('select a.flow_id as flowId, a.manu_id as manuId, a.manu_number as manuNumber, c.phase_name as phaseName,' +
        ' a.review_status as status, a.is_agree as isAgree, a.opinion as opinion,' +
        ' a.opinion_modified as opinionModified, a.opiniontoauthor, b.participant_name as examinername,' +
        ' a.actual_date as examineDate ' +
        'from manuflow a,  participant b, review_phase c ' +
        'where a.handler_id = b.participant_id and a.phase_id = c.phase_id and a.opiniontoauthor_origin is not null ' +
        'and a.manu_id = ' + aid +
        'order by manu_id, flow_id asc;', callback);
};

/**
 * 获取审稿日志
 * @param aid
 * @param callback
 */
examineDB.examLog = function (aid, callback) {
    database.query('select a.log_id as logId, a.manu_id as manuId, a.occurrence_time as examineDate,' +
        ' c.participant_name as submitter, b.participant_name as examiner,' +
        ' a.content from manuscript_log a, participant b, participant c' +
        ' where a.handler_id = b.participant_id and a.submitter_id = c.participant_id and manu_id = ' + aid +
        ' order by occurrence_time asc', callback);
};

/**
 * 获取编辑信息
 * @param uid
 * @param callback
 */
examineDB.getExaminerList = function (uid, callback) {
    database.query('select participant_id as id, login_id as username,' +
            ' participant_name as name, picture as iconPath, dis_onecompany as company, dis_oneaddress as address,' +
            ' email, dis_onephone as mobile, role_committee, role_final, role_reader, role_external, role_author, role_tutor, participant_type as type' +
            ' from participant where participant_type = \'U\'', callback
    );
};

/**
 * 获取外审专家信息
 * @param aid
 * @param callback
 */
examineDB.getMasterList = function (aid, callback) {
    database.query('select participant_id as id, login_id as username,' +
        ' participant_name as name, picture as iconPath, dis_onecompany as company, dis_oneaddress as address,' +
        ' email, dis_onephone as mobile, role_committee, role_final, role_reader, role_external, role_author, role_tutor, participant_type as type' +
        ' from participant where role_external = \'T\'', callback);
};

/**
 * 根据ID获取某篇文章的信息
 * @param aid
 * @param callback
 */
examineDB.getById = function (aid, callback) {
    database.query("select manu_number as publishNo, title, summary from manuscript where manu_id = " + aid, callback);
};


module.exports = examineDB;