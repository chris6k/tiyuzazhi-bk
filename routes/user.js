/**
 * Created by kun
 */
var express = require('express');
var userDB = require('../database/userDB');
var validator = require('validator');
var async = require('async');
var result = require("../result");
var router = express.Router();

router.post('/login', function (req, res) {
    var username = req.param("username");
    var password = req.param("password");
    userDB.getUserInfo(username, password, function (err, recordSet) {
        if (!err) {
            var data = null;
            if (recordSet.length > 0) {
                data = recordSet[0];
                res.status(200).json(new result(true, data, ""));
            } else {
                res.status(200).json(new result(false, data, "未找到用户"));
            }
        } else {
            console.error(err);
            res.status(200).json(new result(false, null, "登录时发生异常"));
        }
    });
});

router.post("/register", function (req, res) {
    var username = req.param("username");
    var password = req.param("password");
    userDB.register(username, password, function (err, recordSet) {
        if (!err) {
            userDB.getUserInfo(username, password, function (err, recordSet) {
                res.status(200).json(new result(true, null, null));
            });
        } else {
            console.error(err);
            res.status(200).json(new result(false, null, "注册用户失败"))
        }
    });
});

router.post("/update", function (req, res) {
    var uid = req.param("uid");
    var name = req.param("name");
    var email = req.param("email");
    var company = req.param("company");
    var tel = req.param("tel");
    userDB.update(uid, name, email, company, tel, function (err, recordSet) {
        if (!err) {
            res.status(200).json(new result(true, null, null));
        } else {
            console.error(err);
            res.status(200).json(new result(false, null, "更新用户信息失败"));
        }
    });
});

/**
 * 获取未处理的任务数
 */
router.get('/todo', function (req, res) {
    var uid = req.param("uid");
    userDB.getToDoCount(uid, function (err, recordSet) {
        if (!err) {
            var data = {};
            if (recordSet.length > 0) {
                data.editor = recordSet[0].editor_todo;
                data.external = recordSet[1].editor_todo;
                data.ceditor = recordSet[2].editor_todo;
                data.author = recordSet[3].editor_todo;
            }
            res.status(200).json(new result(true, data, null));
        } else {
            console.error(err);
            res.status(200).json(new result(false, null, null));
        }
    });
});


router.post('/mailCount', function (req, res) {
    var uid = req.param("uid");
    userDB.getEmailCount(uid, function (err, recordSet) {
        if (!err) {
            var result = null;
            if (recordSet.length > 0) {
                result = recordSet[0];
            } else {
                result = {};
            }
            res.status(200).json({result: true, data: result});
        } else {
            console.error(err);
            res.status(200).json({result: false, data: "发生异常"});
        }
    });
});

module.exports = router;