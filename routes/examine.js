/**
 * Created by kun
 */
var express = require('express');
var examineDB = require('../database/examineDB');
var role_validator = require("../routes/role_validator");
var result = require("../result");
var router = express.Router();

/**
 * 获取待审核的文章
 */
router.get("examArts", role_validator, function (req, res) {
    var uid = req.param("uid");
    examineDB.getAllExamArts(uid, function (err, recordSet) {
        if (err) {
            console.error(err);
            res.status(200).json(new result(false, null, "get data err!"));
        } else {
            var data = [];
            for (var i = 0; i < recordSet.length; i++) {
                data[i] = recordSet[i];
            }
            res.status(200).json(new result(false, data, null));
        }
    });
});

/**
 * 审核文章
 */
router.post("examine", role_validator, function (req, res) {
    var uid = req.param("uid");
    var aid = req.param("articleId");
    var msg = req.param("comment");
    var exam = req.param("status");
    examineDB.examine(aid, uid, exam, msg, function (err, recordSet) {
        if (!err) {
            res.status(200).json(new result(false, null, "exmaine failed!"));
        } else {
            var data = [];
            for (var i = 0; i < recordSet.length; i++) {
                data[i] = recordSet[i];
            }
            res.status(200).json(new result(true, data, ""));
        }
    });
});


/**
 * 获取审稿人信息
 */
router.get("examiner", role_validator, function (req, res) {
    var uid = req.param("uid");
    examineDB.getExaminerList(uid, function (err, recordSet) {
        if (!err) {
            res.status(200).json(new result(false, null, "get examiner info failed"));
        } else {
            var data = [];
            for (var i = 0; i < recordSet.length; i++) {
                data[i] = recordSet[i];
            }
            res.status(200).json(new result(true, data, ""));
        }
    });
});

/**
 * 转交给别的审稿人
 */
router.get("forward", role_validator, function (req, res) {
    var uid = req.param("uid");
    var tid = req.param("tid");
    var aids = req.param("articleIds");
    examineDB.send(uid, tid, aids, function (err, recordSet) {
        if (!err) {
            res.status(200).json(new result(false, null, "forward failed"));
        } else {
            res.status(200).json(new result(true, null, null));
        }
    });
});

/**
 * 获取某篇文章的审稿记录
 */
router.get("history", role_validator, function (req, res) {
    var uid = req.param("uid");
    var aid = req.param("articleId");
    examineDB.examHistory(aid, function (err, recordSet) {
        if (!err) {
            res.status(200).json(new result(false, null, "get history failed"));
        } else {
            var data = [];
            for (var i = 0; i < recordSet.length; i++) {
                data[i] = recordSet[i];
            }
            res.status(200).json(new result(true, data, ""));
        }
    });
});

/**
 * 读取文章信息
 */
router.get("get", role_validator, function (req, res) {
    var aid = req.param("articleId");
    examineDB.getById(aid, function (err, recordSet) {
        if (!err) {
            res.status(200).json(new result(false, null, "get article failed"));
        } else {
            var data = recordSet.length > 0 ? recordSet[0] : {};
            res.status(200).json(new result(true, recordSet, ""));
        }
    });
});
module.exports = router;