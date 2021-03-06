var database = require("../database/mssql_journalx");

var userDB = {};

userDB.getUserInfo = function (usr, remotePassword, callback) {
    var query = 'select participant_id as id, login_id as username,' +
        ' participant_name as name, picture as iconPath, dis_onecompany as company, dis_oneaddress as address,' +
        ' email, dis_onephone as mobile, role_committee, role_final, role_reader, role_external, role_author, role_tutor, participant_type as type' +
        ' from participant where login_id like \'' + usr + "\' and remote_password like \'" + remotePassword + "\'";
    console.log(query);
    database.query(query, callback);
};


userDB.getUnreadMessageCount = function (uid, callback) {
    database.query('select count(*) from ', callback);
}

userDB.getFavCount = function (uid, callback) {
    database.query('', callback);
};

userDB.getEmailCount = function (uid, lastId, callback) {
    var query = 'select mail_id as mailId, text_content as mailContent, subject as mailTitle from mail_queue' +
        ' where DATEADD(dd, 0, DATEDIFF(dd, 0, create_time)) = DATEADD(dd, 0, DATEDIFF(dd, 0, GETDATE())) and mail_to = (select email from participant where participant_id = \'' +
        uid
        + '\') and mail_id > ' + lastId + ' order by create_time desc';
    console.log(query);
    database.query(query, callback);
};

userDB.getUserInfoById = function (uid, callback) {
    database.query('select participant_id as id, login_id as username,' +
        ' participant_name as name, picture as iconPath, dis_onecompany as company, dis_oneaddress as address,' +
        ' email, dis_onephone as mobile, role_committee, role_final, role_reader, role_external, role_author, role_tutor, participant_type as type' +
        ' from participant where id = ' + uid, callback);
};

/**
 * 根据UID获取未处理的任务数
 * @param uid
 * @param callback
 */
userDB.getToDoCount = function (uid, callback) {
    var query = "select count(1) as editor_todo from manuscript a where currentflow_actual_date is null and phase_id in (6,7,10) and exists(select 1 from manuflow b where a.flow_id = b.flow_id and b.handler_id=" + uid + ")" +
        " union all select count(1) as external_todo from manuscript a where currentflow_actual_date is null and phase_id in (9) and exists(select 1 from manuflow b where a.flow_id = b.flow_id and b.handler_id=" + uid + ")" +
        " union all select count(1) as ceditor_todo from manuscript a where currentflow_actual_date is null and phase_id in (24) and exists(select 1 from manuflow b where a.flow_id = b.flow_id and b.handler_id=" + uid + ")" +
        " union all  select count(1) as author_todo  from manuscript a where a.currentflow_actual_date is null and a.phase_id in (6,7,9,10,24) and exists(select 1 from manuscript_authors b where a.manu_id = b.manu_id and b.person_key=" + uid + ")";
    console.log(query);
    database.query(query, callback);
};

/**
 * 这个一个普通用户
 * @param username
 * @param password
 * @param callback
 */
userDB.register = function (username, password, callback) {
    var query = 'insert into participant(login_id, remote_password,participant_name, email, picture , dis_onecompany, dis_oneaddress, dis_onephone , role_committee,' +
        ' role_final, role_reader, role_external, role_author, role_tutor,' +
        ' participant_type) values(\'' + username + '\',\'' + password + '\',\'' + username + '\',\'' + username + '\',\'\',\'\',\'\',\'\',\'F\',\'F\',\'T\',\'F\',\'T\',\'F\',\'P\')';
    console.log(query);
    database.query(query, callback);
};


/**
 * 更新用户信息
 * @param uid
 * @param name
 * @param email
 * @param company
 * @param tel
 * @param callback
 */
userDB.update = function (uid, name, email, company, tel, callback) {
    database.query('update participant set email=\'' + email + '\', participant_name=\'' + name + "\', email=\'" + email + "\'," +
        ' dis_onecompany=\'' + company + '\', dis_onephone=\'' + tel + '\' where participant_id=' + uid, callback);
};


module.exports = userDB;