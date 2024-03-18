var express = require('express');
var router = express.Router();
var apis = require('../apiBaseUrl');
const { default: axios } = require('axios');
var host = apis.solarTracker;
var username = process.env.USERNAME_PASSWORD
var password = process.env.USERNAME_PASSWORD
var userType = process.env.USERTYPE

router.post('/startStopAzimuth',async function(req,res){
    
    
  var direction = req.body.direction;
  // console.log("Line 12 back " + direction )
  // console.log(username + " " + password + " " + userType);
  var accessKey = 0;
  
   await axios.get(`${host}/login?username=${username}&password=${password}&usertype=${userType}&panel=Manually_Controlled`).then(function(response){
      accessKey = response.data.message;
      console.log(accessKey)
    }).catch(function(err){
      console.log("Error: " + err)
    })
    console.log()
   console.log(`${host}/start_azimuth?accesskey=${accessKey}&panel=Manually_Controlled`) 
   await axios.get(`${host}/is_control_user?accesskey=${accessKey}&panel=Manually_Controlled`).then(function(response){
      console.log(response.data);
    })


    await axios.get(`${host}/start_azimuth?panel=Manually_Controlled&accesskey=${accessKey}&direction=${direction}`).catch(function(err){
      console.log("Error: " + err)
    })
     await sleep(2000);
     console.log(`${host}/stop_azimuth?accesskey=${accessKey}&panel=Manually_Controlled`);
    await axios.get(`${host}/stop_azimuth?panel=Manually_Controlled&accesskey=${accessKey}`).catch(function(err){
      console.log("Error: " + err)
    })

    res.send({success:true,message:`Successfully moved the Solar Panel`});
    


})
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

router.post('/startStopElevation', async function(req,res){
var direction = req.body.direction;
var accessKey = 0;
console.log(accessKey);
await axios.get(`${host}/login?username=${username}&password=${password}&usertype=${userType}&panel=Manually_Controlled`).then(function(response){
  accessKey = response.data.message;
}).catch(function(err){
  console.log("Error: " + err)
})

await axios.get(`${host}/is_control_user?accesskey=${accessKey}&panel=Manually_Controlled`).then(function(response){
  console.log(response.data);
})
console.log(`${host}/start_elevation?panel=Manually_Controlled&accesskey=${accessKey}&direction=${direction}`)
await axios.get(`${host}/start_elevation?panel=Manually_Controlled&accesskey=${accessKey}&direction=${direction}`).catch(function(err){
  console.log("Error: " + err)
})
 await sleep(2000);
 console.log(`${host}/stop_elevation?panel=Manually_Controlled&accesskey=${accessKey}`)
await axios.get(`${host}/stop_elevation?panel=Manually_Controlled&accesskey=${accessKey}`).catch(function(err){
  console.log("Error: " + err)
  res.send({success:false});
})
res.send({success:true,message:`Successfully moved the Solar Panel`});
})
router.post('/moveAzimuth',async function(req,res){
    console.log(req.body)
    var degreesToMove = req.body.angleToMove
    var currentAzimuth = 0;
    await axios.get(`${host}/get_azimuth?panel=Manually_Controlled`).then(function(response){
       currentAzimuth =  response.data.azimuth;
    })
    if(currentAzimuth + degreesToMove >= 355 || currentAzimuth + degreesToMove < 5 ){
        res.send({success:false,message:"The angle is to large or small to move the solar panel"})
    }else{
        var accessKey = 0;
        console.log(username + " " + password + " " + userType)
        await axios.get(`${host}/login?username=${username}&password=${password}&usertype=${userType}&panel=Manually_Controlled`).then(function(response){
            accessKey = response.data.message;
          }).catch(function(err){
            console.log("Error: " + err)
          })
          console.log(accessKey);
          await axios.get(`${host}/is_control_user?accesskey=${accessKey}&panel=Manually_Controlled`).then(function(response){
            console.log(response.data);
          })
          await axios.get(`${host}/move_azimuth?azimuth=${degreesToMove}&accesskey=${accessKey}&panel=Manually_Controlled`).catch(function(err){
            res.send({success:false,message:"Error: " + err});
          }).catch(function(err){
            console("Error: " + err);
          })
          //res.send({success:true,message:"Successfully Moved the Solar Panel"})
        }
})


module.exports=router;