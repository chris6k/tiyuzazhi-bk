var database = require("../database/mssql");
var validator = require("validator");
var config = require("../database/home_config");
database.config = config;

var magazineDB = {};
/**
 * list periodical
 * @param callback
 */
magazineDB.listPeriodical = function (callback) {
    database.query('select id, name,' +
        ' viceTitle, summary, name_en,' +
        ' viceTitle_en, summary_en as' +
        ' from periodical', callback);
};

/**
 * get newest magazine info;
 * @param callback
 */
magazineDB.listMagazines = function (callback) {
    database.query('select b.id as id, a.name as title, a.name_en as subTitle, b.name as publishNo,' +
        ' (b.publshDate) as publishTime' +
        ' from periodical a, issue b' +
        ' where a.id = b.periodicalId and b.id in (' +
        ' select max(id)' +
        ' from issue group by periodicalId)', callback);
};

/**
 * get magazine item info by id;
 * @param id --id of periodical.
 * @param callback
 */
magazineDB.listArticles = function (id, callback) {
    database.query('select a.id, a.name as title, a.creationdate as publishTime, a.author' +
        ' from article a, issue b' +
        ' where a.issueId = b.id and b.id=\'' + id + "\'" +
        ' order by a.creationdate desc', callback);
};

/**
 * get id of next periodical by current id;
 * @param id
 * @param callback
 */
magazineDB.getNextMagazineId = function (id, callback) {
    database.query('select top 1 id' +
        ' from issue' +
        ' where id > \'' + id + '\' and periodicalId in' +
        ' (select periodicalId from issue where id = \'' + id + '\') order by id asc', callback);
};

/**
 * get id of previous periodical by current id;
 * @param id
 * @param callback
 */
magazineDB.getPreviousMagazineId = function (id, callback) {
    database.query('select top 1 id' +
        ' from issue' +
        ' where id < \'' + id + '\' and periodicalId in' +
        ' (select periodicalId from issue where id = \'' + id + '\') order by id desc', callback);
};

/**
 * get periodical by id;
 * @param id
 * @param callback
 */
magazineDB.getMagazine = function (id, callback) {
    database.query('select b.id as id, a.name as title, a.name_en as subTitle, b.name as publishNo,' +
        ' (b.publshDate) as publishTime' +
        ' from periodical a, issue b' +
        ' where a.id = b.periodicalId and b.id in (' +
        id +
        ')', callback);
};

magazineDB.search = function (keywords, index, callback) {
    if (!index) {
        index = 0;
    }
    var sql = 'select top 10 id, name as title, creationdate as publishTime, author from article where id not in (select top ' + index + ' id' +
        ' from article a' +
        ' where ' + buildSearchQuery(keywords, true) + ' order by id asc) and (' + buildSearchQuery(keywords, false) + ') order by id asc';
    console.log("sql => " + sql);
    database.query(sql, callback);
}

var buildSearchQuery = function (keywords, hasPrefix) {
    var prefix = "";
    if (hasPrefix) {
        prefix = "a.";
    }
    var query = prefix + "name like '%" + keywords + "%'";
    if (validator.isNumeric(keywords)) {
        query += " or " + prefix + "id = " + keywords;
    } else {
        query += " or " + prefix + "author like '%" + keywords + "%'";
    }
    query += " or " + prefix + "keyword like '%" + keywords + "%'";
    query += " or " + prefix + "keyword_en like '%" + keywords + "%'";
    query += " or " + prefix + "wenxianhao like '%" + keywords + "%'";
    query += " or " + prefix + "fenleihao like '%" + keywords + "%'";
    return query;
}

module.exports = magazineDB;