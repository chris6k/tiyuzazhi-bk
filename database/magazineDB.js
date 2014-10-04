var database = require("../database/mssql");
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
    database.query('select b.id as id, a.name as name, a.name_en as subTitle, b.name as publishNo,' +
        ' (b.publshDate) as publishDate' +
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
    database.query('select a.id, a.name as title, a.creationdate as \'datetime\'' +
        ' from article a, issue b' +
        ' where a.issueId = b.id and b.id=\'' + id + "\'" +
        ' order by creationdate desc', callback);
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

module.exports = magazineDB;