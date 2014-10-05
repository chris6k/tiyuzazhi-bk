var database = {};
var mssql = require("mssql");
var config = require("../database/db_config");

/**
 * get conn from connection pool;
 * @param callback --function(conn, mssql, err);
 * @returns {exports.Connection}
 */
var getConn = function (callback) {
    var conn = new mssql.Connection(config, function (err) {
        callback(conn, mssql, err);
    });
    conn.on("error", function(err) {
        console.log('Error');
        console.error(err.stack);
        console.log(err);
    });
    return conn;
};

/**
 * execute statement with transaction;
 * @param callback -- function(err, resultSet);
 */
var transaction = function (statement, callback) {
    getConn(function (conn, mssql, err) {
        if (err) {
            callback(err, null);
            return;
        }

        var transaction = new mssql.Transaction(conn);
        transaction.begin(function (err) {
            if (err) {
                callback(err, null);
                return;
            }
            var request = new mssql.Request(transaction);
            request.query(statement, function (err, resultSet) {
                if (err) {
                    //if err then rollback;
                    transaction.rollback(callback);
                } else {
                    //commit transaction;
                    transaction.commit(function (err) {
                        callback(err, resultSet);
                    });
                }
            });

        });
    });
};


/**
 * exeucte sql query without transaction;
 * @param statement
 * @param callback -- function(err, recordSet);
 */
var query = function (statement, callback) {
    getConn(function (conn, mssql, err) {
        if (err) {
            callback(err, null);
            return;
        }
        var request = new mssql.Request(conn);
        request.query(statement, callback);
    });
};

database.getConn = getConn;
database.transaction = transaction;
database.query = query;
module.exports = database;



