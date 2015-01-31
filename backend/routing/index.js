var express = require('express');
var router = express.Router();

var deviceDetector = require('device-detective');

var winston = require('winston');


/* GET home page. */
router.get('/', function (req, res) {
    res.render('home', {title: "DMMW"});
});

router.get('/game', function (req, res) {
    res.render('canvas', {title: "DMMW"});
});

router.get('/enterName', function (req, res) {
    res.render('enter_name', {title: "DMMW"});
});

router.get('/controller', function (req, res) {
    res.render('controller', {title: "DMMW"});
});

router.get('/private', function (req, res) {
    res.render('private_game', {title: "DMMW"});
});

router.get('/enterInfos', function (req, res) {
    res.render('enter_infos', {title: "DMMW"});
});

router.get('/waitingScreen', function (req, res) {
    res.render('waitingscreen', {title: "DMMW"});
});

module.exports = router;