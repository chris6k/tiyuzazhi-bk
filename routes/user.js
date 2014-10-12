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
            var result = [];
            for (var i = 0; i < recordSet.length; i++) {
                result[i] = recordSet[i];
            }
            res.status(200).json({result: true, data: result});
        } else {
            res.status(200).json({result: false, data: "发生异常"});
        }
    });
});

router.post('/mailCount', function (req, res) {
    var username = req.param("username");
    var password = req.param("password");
    userDB.getUserInfo(username, password, function (err, recordSet) {
        if (!err) {
            var result = [];
            for (var i = 0; i < recordSet.length; i++) {
                result[i] = recordSet[i];
            }
            res.status(200).json({result: true, data: result});
        } else {
            res.status(200).json({result: false, data: "发生异常"});
        }
    });
});

module.exports = router;