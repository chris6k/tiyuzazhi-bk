var express = require("express");
var app = new express();
var config;
//config for development environment;
if (app.get('env') === 'development') {
    config = {
        user: 'tiyukeji',
        password: '',
        server: 'localhost',
        database: 'tiyukeji',
        pool: {
            max: 10,
            min: 1,
            idleTimeoutMillis: 30000
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
        }
    }
}
module.exports = config;