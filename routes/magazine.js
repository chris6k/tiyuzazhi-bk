/**
 * Created by kun
 */
var express = require('express');
var magazineDB = require('../database/magazineDB');
var validator = require('validator');
var async = require('async');
var router = express.Router();

var returnArticles = function (err, recordSet) {
    if (!err) {
        var result = [];
        for (var i = 0; i < recordSet.length; i++) {
            result[i] = recordSet[i];
        }
        res.json(200, {result: ture, data: result});
    } else {
        res.json(200, {result: false, data: "发生异常"});
    }
};

var checkParam = function (req, res, next) {
    var magId = req.param("magId");
    if (!validator.isNumeric(magId)) {
        res.json(400, {result: false, data: "invalid param magId"});
    } else {
        next();
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
            res.json(200, {result: ture, data: result});
        } else {
            res.json(200, {result: false, data: "发生异常"});
        }
    });
});


/**
 * 获取杂志目录信息
 */
router.get('/articles', checkParam, function (req, res) {
    var magId = req.param("magId");
    magazineDB.listArticles(magId, returnArticles);
});

/**
 * 获取下一期杂志目录信息
 */
router.get('/nextMag', function (req, res) {
    var magId = req.param("magId");
    async.waterfall(
        function (callback) {
            magazineDB.getNextMagazineId(magId, function (err, recordSet) {
                if (!err && recordSet.length > 0) {
                    var nextId = recordSet[0].id;
                    callback(null, nextId);
                } else {
                    res.json(200, {result: false, data: (err ? "get next magazine failed!" : [])});
                    callback("no next magazine", null);
                }
            });

        },
        function (nextId, callback) {
            magazineDB.listArticles(nextId, returnArticles);
        }
    );
});

/**
 * 获取上一期杂志目录信息
 */
router.get('/prevMag', function (req, res) {
    var magId = req.param("magId");
    async.waterfall(
        function (callback) {
            magazineDB.getPreviousMagazineId(magId, function (err, recordSet) {
                if (!err && recordSet.length > 0) {
                    var nextId = recordSet[0].id;
                    callback(null, nextId);
                } else {
                    res.json(200, {result: false, data: (err ? "get previous magazine failed!" : [])});
                    callback("no previous magazine", null);
                }
            });

        },
        function (nextId, callback) {
            magazineDB.listArticles(nextId, returnArticles);
        }
    );
});

module.exports = router;