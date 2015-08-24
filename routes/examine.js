/**
 * Created by kun
 */
var express = require('express');
var examineDB = require('../database/examineDB');
var role_validator = require("../routes/role_validator");
var result = require("../result");
var async = require("async");
var router = express.Router();

/**
 * 获取待审核的文章
 */
router.get("/examArts", function (req, res) {
    var uid = req.param("uid");
    var flowId = req.param("step");
    var offset = req.param("of");
    var isAsc = req.param("asc");
    examineDB.getAllEditorArts(uid, flowId, offset, isAsc, function (err, recordSet) {
        if (err) {
            console.error(err);
            res.status(200).json(result(false, null, "get data err!"));
        } else {
            try {
                var data = [];
                for (var i = 0; i < recordSet.length; i++) {
                    data[i] = recordSet[i];
                }
                res.status(200).json(result(true, data, null));
            } catch (e) {
                console.error(e);
            }
        }
    });
});

/**
 * 获取历史
 */
router.get("/examHist", function (req, res) {
    var aid = req.param("aid");
    examineDB.examHistory(aid, function (err, recordSet) {
        if (err) {
            console.error(err);
            res.status(200).json(result(false, null, "get data err!"));
        } else {
            try {
                var data = [];
                for (var i = 0; i < recordSet.length; i++) {
                    data[i] = recordSet[i];
                }
                res.status(200).json(result(true, data, null));
            } catch (e) {
                console.error(e);
            }
        }
    });
});

/**
 * 审核文章
 * 1. 更新person_reviewer表 2.更新manuflow表 3.更新mail_queue表
 */
router.post("/examine", function (req, res) {
    var uid = req.param("uid");
    var aid = req.param("articleId");
    var msg = req.param("comment");
    var exam = req.param("status");
    examineDB.examine(aid, uid, exam, msg, function (err, recordSet) {
        if (err) {
            res.status(200).json(result(false, null, "exmaine failed!"));
        } else {
            var data = [];
            for (var i = 0; i < recordSet.length; i++) {
                data[i] = recordSet[i];
            }
            res.status(200).json(result(true, data, ""));
        }
    });
});


/**
 * 获取审稿人信息
 */
router.get("/examiner", role_validator, function (req, res) {
    var uid = req.param("uid");
    examineDB.getExaminerList(uid, function (err, recordSet) {
        if (err) {
            res.status(200).json(result(false, null, "get examiner info failed"));
        } else {
            var data = [];
            for (var i = 0; i < recordSet.length; i++) {
                data[i] = recordSet[i];
            }
            res.status(200).json(result(true, data, ""));
        }
    });
});

/**
 * 转交给别的审稿人
 */
router.get("/forward", function (req, res) {
    var uid = req.param("uid");
    var tid = req.param("tid");
    var aid = req.param("articleId");
    async.waterfall([
        function (callback) {
            examineDB.send(uid, tid, aids, function (err, recordSet) {
                callback(err);
            });
        }], function (err, result) {
        if (err) {
            res.status(200).json(result(false, null, "forward failed"));
        } else {
            res.status(200).json(result(true, null, null));
        }
    });

});

/**
 * 获取某篇文章的审稿记录
 */
router.get("/history", function (req, res) {
    // var uid = req.param("uid");
    var aid = req.param("articleId");
    examineDB.examHistory(aid, function (err, recordSet) {
        if (err) {
            res.status(200).json(result(false, null, "get history failed"));
        } else {
            var data = [];
            for (var i = 0; i < recordSet.length; i++) {
                data[i] = recordSet[i];
            }
            res.status(200).json(result(true, data, ""));
        }
    });
});


var patch = [6,8,10,11];
/**
 * 读取文章信息
 */
router.get("/get", function (req, res) {
    var aid = req.param("aid");
    var uid = req.param("uid");
    var exec, id;
    if (aid) {
        exec = examineDB.getById;
        id = aid;
    } else {
        exec = examineDB.getByUid;
        id = uid;
    }
    try {
        exec(id, function (err, recordSet) {
            if (err) {
                res.status(200).json(result(false, null, "get article failed"));
            } else {
                var data = recordSet.length > 0 ? recordSet[0] : {};
                //patch
                if (data.step) {
                    for (var i = 0; i < patch.length; i++) {
                        if (data.step === patch[i]) {
                            res.status(200).json(result(true, data, ""));
                            return;
                        }
                    }
                    data.step = 0;
                }
                res.status(200).json(result(true, data, ""));
            }
        });
    } catch (e) {
        console.error(e);
    }
});
module.exports = router;