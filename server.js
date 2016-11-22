/**
 * Created by Victor on 13/11/16.
 */

var express = require("express");
var algo = require('./algo');
var app = express();

function run() {
    var server = app.listen(process.env.PORT || 8080, function () {
        var port = server.address().port;
    });
}

// CONTACTS API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({"error": message});
}

app.get("/totp/", function(req, res) {
    var info;

    if (!req.header('secret')
        || !req.header('algohash')
        || !req.header('timestep')
        || !req.header('length')
        || !req.header('timestart')) {
        handleError(res, "missing parameters", "missing parameters", 404);
        return ;
    }

    var secret = req.header('secret');
    var algohash = req.header('algohash');
    if (algohash != 'sha1' && algohash != 'sha256' && algohash != 'sha512') {
        algohash = 'sha1';
    }
    var timestep = req.header('timestep');
    var length = req.header('length');
    if (length < 6 || length > 8) {
        length = 6;
    }
    var timestart = req.header('timestart');

    var value = algo.totp(secret, timestep, timestart, length, algohash);
    if (!value) {
        handleError(res, "null", "null", 400);
        return ;
    }
    info = {totp: value[0], counter: value[1].toString()};
    res.status(200).json(info);
});

app.get("/hotp/", function(req, res) {
    var info;

    if (!req.header('secret')
        || !req.header('algohash')
        || !req.header('length')
        || !req.header('counterOffSet')) {
        handleError(res, "missing parameters", "missing parameters", 404);
        return ;
    }

    var counterOffSet = req.header('counterOffSet');
    var secret = req.header('secret');
    var algohash = req.header('algohash');
    if (algohash != 'sha1' && algohash != 'sha256' && algohash != 'sha512') {
        algohash = 'sha1';
    }

    var length = req.header('length');
    if (length < 6 || length > 8) {
        length = 6;
    }

    var value = algo.hotp(counterOffSet, secret, length, algohash);
    if (!value) {
        handleError(res, "null", "null", 400);
        return ;
    }
    var info  = [];
    info.push({hotp: value[0], counter:value[1]});
    //info += {"counter": counterOffSet.toString()};
    res.status(200).json(info);
});

exports.run = run;
