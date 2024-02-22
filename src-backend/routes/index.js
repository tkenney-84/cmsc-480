var express = require('express');
var router = express.Router();
var connection = global.database;
var apis = require('../apiBaseUrl')
var axios = require('axios')
var validInput = /^[A-Za-z0-9*&^%$#@!&*+]+$/;
var invalidText = /[^a-zA-Z]/;
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CMSC480' });
});

//Returns a string to verify that GET requests to the server are working.
router.get('/testGet', function(req, res, next) {
  var query = 'SELECT * FROM user WHERE id = ?;';
  if (req.query.record == "") {
    res.send(JSON.stringify("No record specified."));
  } else {
    connection.query(query, [req.query.record], function(err, results) {
      res.send(JSON.stringify(results[0].name));
    });
  }
});

router.post('/testPost', function(req, res) {
  var query = 'INSERT INTO user (name) VALUES (?);';
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
      for(let i = 0; i < 2; i++){
        result.push(Math.floor(Math.random() * (100 - 1) + 1));
      }
      result.sort(function(a,b){return a- b});
      console.log(result);
      res.send({randomNumbers:result});

})
router.post('/solarCoordinates', function(req,res){
  console.log(req.body)
  if(req.body.lat == '' || req.body.long == ''){
    res.send(JSON.stringify("No altitude or longitude specified"))
  }else{
    //eventually Store this in the data base 
    var key =apis.solarPositionKey;
    var apiEndpoint =`${apis.solarPosition}apiKey=${key}&lat=${req.body.lat}&long=${req.body.long}`; 

     axios.get(apiEndpoint).then((response)=>{
       
        res.send({sunAltitude:response.data.sun_altitude,sunAzimuth:response.data.sun_azimuth});
    })  
  }
})
router.post('/findUser', (req,res)=>{
  var userId = req.body.userId;
  //console.log(userId)
  if(userId == 0){
    res.send(JSON.stringify("Invalid User Id"))
  }if(userId.match(validInput) == null){
    res.send(JSON.stringify("Invalid Input"))
  }else{
    var query = `select*from user where user_id=${userId}`
    connection.query(query,(err, rows)=>{``
      if(err)console.log('invalid User')
      if(rows == []){
        res.send(JSON.stringify("User Dose not exist"))
      }else{
        res.send({rows:rows})
      }

    })
  }


})
router.post('/createUser',(req,res)=>{
  console.log(req.body)
  var createUsername = req.body.createUsername;
  var createPassword = req.body.createPassword; 
  console.log(createPassword.match(invalidText) != null)
  if(createUsername == "" || createPassword == ""){
    res.send(JSON.stringify("no value inserted"))
  }if(createUsername.match(invalidText) != null || createPassword.match(invalidText) != null){
    res.send(JSON.stringify("Invalid Input"))
    console.log("Invalid Username or Password Input (only letters)")
   }
  else{
    var query = `INSERT INTO user (username, password) VALUES ('${createUsername}','${createPassword}');`
    connection.query(query,(err,rows)=>{``
      if(err){

        res.send({isSuccessful:false})
      }
      else{

        res.send({createUsername:createUsername,createPassword:createPassword,isSuccessful:true})
      }
    
    })
  }

  // if(firstName)
})
router.get('/getPanelPosition',function(req,res){
  var host = apis.solarTracker;
  console.log(`${host}/get_position?panel=Manually_Controlled`)
  axios.get(`${host}/get_position?panel=Manually_Controlled`).then((response) =>{
      console.log(response);

  }).catch(function(err) {
    console.error("ERROR", err);
  })


})


module.exports = router;
