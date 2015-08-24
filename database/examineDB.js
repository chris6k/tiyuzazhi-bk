var database = require("../database/mssql_journalx");
var async = require("async");
var examineDB = {};

/**
 * 外审获取待审核的文章
 * @param uid 用户的ID
 * @param callback
 */
examineDB.getAllExamArts = function (uid, callback) {
    var query = "select a.manu_id as id, a.summary, a.manu_number as draftNo," +
        "a.currentflow_submit_date as examineStart," +
        "a.currentflow_actual_date as examineFinish," +
        "a.currentflow_plan_date as examineEnd, a.review_status as state," +
        "a.currentflow_handler_name as opName, a.manu_type_id as category," +
        "a.phase_id as step," +
        "b.opinion_modified as comment, b.handler_id as opId, b.score as score" +
        "from manuscript a, manuflow b where a.flow_id = b.flow_id and b.handler_id = " + uid + " order by examineStart asc";
    database.query(query, callback);
};

/**
 * 編輯获取待审核文章
 * @param uid
 * @param flowid
 * @param offset
 * @param isAsc
 * @param callback
 */
examineDB.getAllEditorArts = function (uid, flowid, offset, isAsc, callback) {
    if (!offset) {
        offset = 0;
    }
    var query = "select top 10 a.manu_id as id, a.summary,a.title as title,a.submit_date as submitDate, a.manu_number as draftNo," +
        "a.currentflow_submit_date as examineStart," +
        "a.currentflow_actual_date as examineFinish," +
        "a.currentflow_plan_date as examineEnd, a.review_status as state," +
        "a.currentflow_handler_name as opName, a.manu_type_id as category," +
        "a.phase_id as step," +
        "b.opinion_modified as comment, b.handler_id as opId, b.score as score," +
        "(select top 1 f.participant_name from manuflow e, participant f where e.handler_id = f.participant_id and e.manu_id = a.manu_id and e.flow_id < a.flow_id order by e.flow_id desc) as prevOpName, a.currentflow_submit_date as prevExamineFinish" +
        " from manuscript a, manuflow b where a.manu_id not in (select top " + offset +
        " c.manu_id from manuscript c, manuflow d where " +
        " c.flow_id = d.flow_id and a.manu_number is not null and (d.handler_id=" + uid + " or d.handler_id in (select user_key from user_in_group where group_id in (select group_id from user_in_group where user_key=" + uid + ")))";
    if (flowid) query += " and c.phase_id = " + flowid;
    query = query + " order by c.submit_date " + (isAsc == 0 ? " desc " : " asc ") + ") and (a.flow_id = b.flow_id and a.manu_number is not null and (b.handler_id=" + uid + " or b.handler_id in (select user_key from user_in_group where group_id in (select group_id from user_in_group where user_key=" + uid + ")))";
    if (flowid) query += " and a.phase_id = " + flowid;
    query += ") order by submitDate";
    if (isAsc == 0)
        query += " desc ";
    console.log(query);
    database.query(query, callback);
};

/**
 * 主编获取待审核文章
 * @param uid
 * @param callback
 */
examineDB.getAllCEditorArts = function (uid, flowid, offset, isAsc, callback) {
    if (!offset) {
        offset = 0;
    }
    var query = "select top 10 a.manu_id as id, a.summary,a.title as title,a.submit_date as submitDate, a.manu_number as draftNo," +
        "a.currentflow_submit_date as examineStart," +
        "a.currentflow_actual_date as examineFinish," +
        "a.currentflow_plan_date as examineEnd, a.review_status as state," +
        "a.currentflow_handler_name as opName, a.manu_type_id as category," +
        "a.phase_id as step," +
        "b.opinion_modified as comment, b.handler_id as opId, b.score as score" +
        " from manuscript a, manuflow b where a.manu_id not in (select top " + offset +
        " c.manu_id from manuscript c, manuflow d where c.currentflow_actual_date is null " +
        "and c.flow_id = d.flow_id and a.manu_number is not null and a.manu_number != '' and d.handler_id=" + uid;
    if (flowid) query += " and c.phase_id = " + flowid;
    query = query + " order by c.currentflow_submit_date " + (isAsc == 0 ? " desc " : " asc ") + ") and (a.flow_id = b.flow_id and a.manu_number is not null and a.manu_number != '' and a.currentflow_actual_date is null and b.handler_id = " + uid;
    if (flowid) query += " and a.phase_id = " + flowid;
    query += ") order by examineStart";
    if (isAsc == 0)
        query += " desc ";
    console.log(query);
    database.query(query, callback);
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
    database.query('select participant_id as id, login_id as username,' +
        ' participant_name as name, picture as iconPath, dis_onecompany as company, dis_oneaddress as address,' +
        ' email, dis_onephone as mobile, role_committee, role_final, role_reader, role_external, role_author, role_tutor, participant_type as type' +
        ' from participant a, manuscript_reviewer b where a.participant_id = b.person_key and b.manu_id=' + manuid + " and tuijian=\'T\'", callback);
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
    var query = 'select a.flow_id as flowId, a.phase_id as step, a.manu_id as id, a.manu_number as draftNo, c.phase_name as phaseName,' +
        ' a.review_status as status, a.is_agree as isAgree, a.opinion as opinion,' +
        ' a.opinion_modified as comment, a.opiniontoauthor, b.participant_name as examinername,' +
        ' a.actual_date as examineFinish, a.plan_date as examineEnd, a.submit_date as examineStart ' +
        ' from manuflow a,  participant b, review_phase c ' +
        ' where a.handler_id = b.participant_id and a.phase_id = c.phase_id ' +
        ' and a.manu_id = ' + aid +
        ' order by flow_id desc';
    console.log(query);
    database.query(query, callback);
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
    var query = "select a.manu_id as id, a.dis_authors as author,a.title as title, a.summary,a.submit_date as submitDate, a.manu_number as draftNo," +
        " a.currentflow_submit_date as examineStart," +
        " a.currentflow_actual_date as examineFinish," +
        " a.currentflow_plan_date as examineEnd, a.review_status as state," +
        " a.currentflow_handler_name as opName, a.manu_type_id as category," +
        " a.phase_id as step," +
        " b.opinion_modified as comment, b.handler_id as opId, b.score as score" +
        " from manuscript a, manuflow b, manuscript_authors c where  a.manu_id = c.manu_id and a.flow_id = b.flow_id and a.manu_id = " + aid;
    console.log(query);
    database.query(query, callback);
};

examineDB.getByUid = function (uid, callback) {
    var query = "select top 1 a.manu_id as id,a.title as title, a.summary,a.submit_date as submitDate, a.manu_number as draftNo," +
        "a.currentflow_submit_date as examineStart," +
        "a.currentflow_actual_date as examineFinish," +
        "a.currentflow_plan_date as examineEnd, a.review_status as state," +
        "'' as opName, a.manu_type_id as category," +
        "a.phase_id as step, b.opinion_modified as comment, b.handler_id as opId, b.score as score" +
        " from manuscript a, manuflow b, manuscript_authors c " +
        " where a.flow_id = b.flow_id and a.manu_id = c.manu_id and c.person_key = " + uid +
        " order by currentflow_submit_date desc";
    console.info(query);
    database.query(query, callback);
};


module.exports = examineDB;