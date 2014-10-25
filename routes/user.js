/**
 * Created by kun
 */
var express = require('express');
var userDB = require('../database/userDB');
var validator = require('validator');
var async = require('async');
var router = express.Router();

router.post('/login', function (req, res) {
    var username = req.param("username");
    var password = req.param("password");
    userDB.getUserInfo(username, password, function (err, recordSet) {
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