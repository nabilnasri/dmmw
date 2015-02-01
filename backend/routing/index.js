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
    res.render('pregame/enter_name', {title: "DMMW"});
});

router.get('/registratephone', function (req, res) {
    res.render('pregame/phone_registration', {title: "DMMW"});
});

router.get('/controller', function (req, res) {
    res.render('controller/controller', {title: "DMMW"});
});

router.get('/private', function (req, res) {
    res.render('pregame/private_game', {title: "DMMW"});
});

router.get('/enterInfos', function (req, res) {
    res.render('pregame/enter_infos', {title: "DMMW"});
});

router.get('/waitingScreen', function (req, res) {
    res.render('pregame/waitingscreen', {title: "DMMW"});
});

module.exports = router;