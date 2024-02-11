var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CMSC480' });
});

// Returns a string to verify that GET requests to the server are working.
router.get('/test', function(req, res, next) {
  res.send('GET requests to the server are working.');
});

module.exports = router;
