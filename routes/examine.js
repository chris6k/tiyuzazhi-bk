/**
 * Created by kun
 */
var express = require('express');
var examineDB = require('../database/examineDB');
var validator = require('validator');
var async = require('async');
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
router.examine("examine", role_validator, function (req, res) {

});
module.exports = router;