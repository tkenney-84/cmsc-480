var express = require('express');
var router = express.Router();
var connection = global.database;
var axios = require('axios')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CMSC480' });
});

//Returns a string to verify that GET requests to the server are working.
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
//sends an array of random numbers to test get request to the front end.
router.get('/sendRandomNumbers',function(req,res){
      var result = [];
      for(let i = 0; i < 25; i++){
        result.push(Math.floor(Math.random() * (100 - 1) + 1));
      }
      result.sort(function(a,b){return a- b});
      console.log(result);
      res.send({randomNumbers:result});

})
router.post('/solarCoordinates',async function(req,res){
  console.log(req.body)
  if(req.body.lat == '' || req.body.long == ''){
    res.send(JSON.stringify("No altitude or longitude specified"))
  }else{
    //eventually Store this in the data base 
    var key ='d9e2f832f360421b93fa7250f9a2ef72';
    var apiEndpoint =`https://api.ipgeolocation.io/astronomy?apiKey=${key}&lat=${req.body.lat}&long=${req.body.long}`; 
    var altitude = "";
    var azimuth = "";
    await axios.get(apiEndpoint).then((response)=>{
        console.log(response)
        res.send({sunAltitude:response.data.sun_altitude,sunAzimuth:response.data.sun_azimuth});
    })  
  }
})

module.exports = router;
