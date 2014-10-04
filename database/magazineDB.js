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
 * get magazine item info;
 * @param callback
 */
magazineDB.listItems = function (callback) {
    database.query('select ', callback);
}
module.exports = magazineDB;