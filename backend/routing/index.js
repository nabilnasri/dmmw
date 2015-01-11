var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('home', {title:"DMMW"});
});

router.get('/game', function(req, res) {
  res.render('canvas', {title:"DMMW"});
});

router.get('/controller', function(req, res) {
  res.render('controller', {title:"DMMW"});
});


module.exports = router;
