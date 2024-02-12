var express = require('express');
var router = express.Router();
var connection = global.database;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CMSC480' });
});

// Returns a string to verify that GET requests to the server are working.
router.get('/testGet', function(req, res, next) {
  var query = 'SELECT * FROM test_table WHERE id = ?;';
  if (req.query.record == "") {
    res.send(JSON.stringify("No record specified."));
  } else {
    connection.query(query, [req.query.record], function(err, results) {
      res.send(JSON.stringify(results[0].name));
    });
  }
});

router.post('/testPost', function(req, res) {
  var query = 'INSERT INTO test_table (name) VALUES (?);';
  if (!req.body.name) {
    res.send(JSON.stringify("No name specified."));
  } else {
    connection.query(query, [req.body.name], function(err, rows, fields) {
      res.send(JSON.stringify(rows.insertId));
    });
  }
});

module.exports = router;
