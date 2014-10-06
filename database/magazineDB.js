var database = require("../database/mssql");
var validator = require("validator");
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
    if (!index || index == 0) {
        index = 10;
    }
    database.query('select top 10 * from (select top ' + index + 'select a.id, a.name as title, a.creationdate as publishTime, a.author' +
        ' from article a, issue b' +
        ' where a.issueId = b.id and (' + buildSearchQuery(keywords) + ')' +
        ' order by a.id asc) m order by id desc', callback);
}

var buildSearchQuery = function (keywords) {
    var query = "a.name like '%" + keywords + "%'";
    if (validator.isNumeric(keywords)) {
        query += " or a.id = " + keywords;
    } else {
        query += " or a.author like '%" + keywords + "%'";
    }
    query += " or a.keyword like '%" + keywords + "%'";
    query += " or a.keyword_en like '%" + keywords + "%'";
    query += " or a.wenxianhao like '%" + keywords + "%'";
    query += " or a.feleihao like '%" + keywords + "%'";
    return query;
}

module.exports = magazineDB;