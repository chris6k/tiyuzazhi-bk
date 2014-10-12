/**
 * Created by kun
 */
var express = require('express');
var userDB = require('../database/userDB');
var validator = require('validator');
var async = require('async');
var router = express.Router();

router.post('/notify', function (req, res) {
    var uid = req.param("uid");
   //TODO
});

module.exports = router;