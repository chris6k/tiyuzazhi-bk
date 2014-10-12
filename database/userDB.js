var database = require("../database/mssql_journalx");
var validator = require("validator");

var userDB = {};

userDB.getUserInfo = function(usr, remotePassword, callback) {
    database.query('select participant_id as id, login_id as username,' +
            ' participant_name as name, picture as iconPath, dis_onecompany as company, dis_oneaddress as address,' +
            ' email, dis_onephone as mobile, role_committee, role_final, role_reader, role_external' +
            ' from participant where login_id = ' + usr+ " and remote_password = " + remotePassword, callback );
};


userDB.getUnreadMessageCount = function(uid, callback) {
    database.query('select count(*) from ', callback);
}

userDB.getFavCount = function(uid, callback) {
    database.query('', callback);
}

userDB.getEmailCount = function(uid, callback) {
    database.query('select max(mail_id) as mailId, count(mail_id) as mailCount from mail_queue' +
    ' where DATEADD(dd, 0, DATEDIFF(dd, 0, create_time)) = DATEADD(dd, 0, DATEDIFF(dd, 0, GETDATE())) and owner_id = \''+
     uid
     + '\' group by create_time', callback);
}



module.exports = userDB;