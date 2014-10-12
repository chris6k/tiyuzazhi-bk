var express = require("express");
var app = new express();
var config;
//config for development environment;
if (app.get('env') === 'development') {
    config = {
        user: 'tiyukeji',
        password: 'tiyukeji',
        server: '192.168.10.109',
        database: 'tiyukeji',
        pool: {
            max: 1,
            min: 1,
            idleTimeoutMillis: 30000
        },
        options: {
            tdsVersion: '7_1'
        }
    }
} else {
    config = {
        user: 'tiyukeji',
        password: '',
        server: 'localhost',
        database: 'tiyukeji',
        pool: {
            max: 10,
            min: 1,
            idleTimeoutMillis: 30000
        },
        options: {
            tdsVersion: '7_1'
        }
    }
}
module.exports = config;