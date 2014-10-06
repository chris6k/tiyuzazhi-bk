/**
 * Created by kun
 */
var express = require('express');
var magazineDB = require('../database/magazineDB');
var validator = require('validator');
var async = require('async');
var router = express.Router();

var returnArticles = function (err, recordSet, res) {
    if (!err) {
        var result = [];
        for (var i = 0; i < recordSet.length; i++) {
            result[i] = recordSet[i];
        }
        res.status(200).json({result: true, data: result});
    } else {
        res.status(200).json({result: false, data: "发生异常"});
    }
};

var returnMagazine = function (nextId, res, callback) {
    magazineDB.getMagazine(nextId, function (err, recordSet) {
        if (!err) {
            var result = null;
            if (recordSet.length > 0) {
                result = recordSet[0];
            }
            res.status(200).json({result: true, data: result});
        } else {
            res.status(200).json({result: false, data: "发生异常"});
        }
    });
}

var checkMagId = function (req, res, next) {
    var magId = req.param("magId");
    if (!validator.isNumeric(magId)) {
        res.status(400).json({result: false, data: "invalid param magId"});
    } else {
        next();
    }
};

var checkKeywords = function (req, res, next) {
    var keywords = req.param("keywords");
    if (keywords) {
        next();
    } else {
        res.status(400).json({result: false, data: "miss required param keywords"});
    }
}


/**
 * 获取最新杂志列表
 */
router.get('/list', function (req, res) {
    magazineDB.listMagazines(function (err, recordSet) {
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


/**
 * 获取杂志目录信息
 */
router.get('/articles', checkMagId, function (req, res) {
    var magId = req.param("magId");
    magazineDB.listArticles(magId, function (err, recordSet) {
        returnArticles(err, recordSet, res)
    });
});

/**
 * 获取下一期杂志目录信息
 */
router.get('/nextMag', function (req, res) {
    var magId = req.param("magId");
    async.waterfall(
        [
            function (callback) {
                magazineDB.getNextMagazineId(magId, function (err, recordSet) {
                    if (!err && recordSet.length > 0) {
                        var nextId = recordSet[0].id;
                        callback(null, nextId, res);
                    } else {
                        res.status(200).json({result: false, data: (err ? "get next magazine failed!" : null)});
                        callback("no next magazine", null, res);
                    }
                });

            }, returnMagazine
        ]
    );
});

/**
 * 获取上一期杂志目录信息
 */
router.get('/prevMag', function (req, res) {
    var magId = req.param("magId");
    async.waterfall(
        [
            function (callback) {
                magazineDB.getPreviousMagazineId(magId, function (err, recordSet) {
                    if (!err && recordSet.length > 0) {
                        var nextId = recordSet[0].id;
                        callback(null, nextId, res);
                    } else {
                        res.status(200).json({result: false, data: (err ? "get previous magazine failed!" : null)});
                        callback("no previous magazine", null, res);
                    }
                });

            }, returnMagazine
        ]
    );
});

/**
 * 根据条件搜索杂志信息
 */
router.get('/search', checkKeywords, function (req, res) {
    var keywords = req.param("keywords");
    var index = req.param("index");
    magazineDB.search(keywords, index, function (err, recordSet) {
        returnArticles(err, recordSet, res)
    });
});

module.exports = router;