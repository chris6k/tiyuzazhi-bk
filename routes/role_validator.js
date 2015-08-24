/**
 * @author chris.xue
 * 验证用户角色
 **/
var userDB = require("../database/userDB");
var result = require("../result");
var async = require("async");
var validator = function (req, res, next) {
    var uid = req.param("uid");
    async.waterfall([
        function (callback) {
            if (!uid) {
                callback("uid is empty");
            } else {
                callback(null);
            }
        },
        function (callback) {
            var user = userDB.getUserInfoById(uid);
            if (!user || user.participant_type !== "" || user.role_external === "T") {
                callback("invalid user");
            } else {
                callback(null);
            }
        }
    ], function (err, result) {
        if (!err) {
            next();
        } else {
            error(res, 400, err);
        }
    });
};

var error = function (res, statusCode, msg) {
    res.status(400).json(result(false, null, msg));
};
module.exports = validator;