var express = require('express');
var router = express.Router();
var apis = require('../apiBaseUrl');
const { default: axios } = require('axios');
var host = apis.solarTracker;
var username = process.env.USERNAME_PASSWORD
var password = process.env.USERNAME_PASSWORD
var userType = process.env.USERTYPE

var maximumMovementDuration = 5; // Seconds
var movementDurationBuffer = 1; // Seconds
var maximumSafeMovementDuration = maximumMovementDuration - movementDurationBuffer; // Seconds
var degreesMovedPerSecond = 7; // Degrees. Verified through observation.

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

router.post('/startStopElevation', async function(req,res){
console.log("line 50")
var direction = req.body.direction;
var accessKey = 0;

await axios.get(`${host}/login?username=${username}&password=${password}&usertype=${userType}&panel=Manually_Controlled`).then(function(response){
  accessKey = response.data.message;
}).catch(function(err){
  console.log("Error: " + err)
})
console.log(accessKey);
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

router.post('/resetElevation', function(req,res) {
  resetElevation();
});
router.post('/resetAzimuth', function(req,res) {
  resetAzimuth();
});
router.post('/resetPanelPosition', function(req,res) {
  resetElevation();
  resetAzimuth();
});

function resetElevation() {

  var defaultElevation = 45; // Degrees
  var currentElevation;

  requestCurrentElevation().then(function(response) {

    currentElevation = response.data.azimuth;

    var degreesToTravel = defaultElevation - currentElevation;

    if (degreesToTravel == 0) { // Already at default.
      return {
        success:true,
        message:"Solar panel is already at default elevation."
      }
    }

    var movesToPerform = Math.floor(degreesToTravel / maximumSafeMovementDuration);
    var finalMoveDuration = degreesToTravel % maximumSafeMovementDuration;

    for (var i = 0; i < movesToPerform; i++) {
      setTimeout(moveElevationBySeconds(maximumSafeMovementDuration, degreesToTravel < 0), i * maximumSafeMovementDuration);
    }

    setTimeout(moveElevationBySeconds(finalMoveDuration, degreesToTravel < 0), movesToPerform * maximumSafeMovementDuration);

  });
}

function resetAzimuth() {

  var defaultAzimuth = 45; // Degrees
  var currentAzimuth;

  requestCurrentAzimuth().then(function(response) {

    currentAzimuth = response.data.azimuth;

    var degreesToTravel = defaultAzimuth - currentAzimuth;

    if (degreesToTravel == 0) { // Already at default.
      return {
        success:true,
        message:"Solar panel is already at default azimuth."
      }
    }

    var movesToPerform = Math.floor(degreesToTravel / maximumSafeMovementDuration);
    var finalMoveDuration = degreesToTravel % maximumSafeMovementDuration;

    for (var i = 0; i < movesToPerform; i++) {
      setTimeout(moveAzimuthBySeconds(maximumSafeMovementDuration, degreesToTravel < 0), i * maximumSafeMovementDuration);
    }

    setTimeout(moveAzimuthBySeconds(finalMoveDuration, degreesToTravel < 0), movesToPerform * maximumSafeMovementDuration);

  });
}

function requestCurrentAzimuth() {
  return axios.get(`${host}/get_azimuth?panel=Manually_Controlled`).catch(function(err) {
    return {
      success:false,
      message:"Error getting current azimuth.",
      data: err
    }
  });
}

function requestCurrentElevation() {
  return axios.get(`${host}/get_elevation?panel=Manually_Controlled`).catch(function(err) {
    return {
      success:false,
      message:"Error getting current elevation.",
      data: err
    }
  });
}

function moveElevationBySeconds(seconds, moveDown) {
  var directon = "Up";
  if(moveDown){
    directon = "Down"
  }
  axios.get(`${host}/login?username=${username}&password=${password}&usertype=${userType}&panel=Manually_Controlled`).then(function(response){
    var accessKey = response.data.message;
    console.log(accessKey)
    axios.get(`${host}/is_control_user?accesskey=${accessKey}&panel=Manually_Controlled`).then(function(response){
     axios.get(`${host}/start_${movementDirection}?panel=Manually_Controlled&accesskey=${accessKey}&direction=${direction}`).then(function(response){
       setTimeout(function(){
         axios.get(`${host}/stop_elevation?panel=Manually_Controlled&accesskey=${accessKey}`).then(function(response){
           console.log("Line 70")
         })
       },seconds)
 
 
     })
   })
 
 
 
 
   })
  
 
}

function moveAzimuthBySeconds(seconds, moveLeft) {
  var direction = "Right"
  if(moveLeft){
    direction = "Left"
  }

  axios.get(`${host}/login?username=${username}&password=${password}&usertype=${userType}&panel=Manually_Controlled`).then(function(response){
    var accessKey = response.data.message;
    console.log(accessKey)
    axios.get(`${host}/is_control_user?accesskey=${accessKey}&panel=Manually_Controlled`).then(function(response){
     axios.get(`${host}/start_${movementDirection}?panel=Manually_Controlled&accesskey=${accessKey}&direction=${direction}`).then(function(response){
       setTimeout(function(){
         axios.get(`${host}/stop_azimuth?panel=Manually_Controlled&accesskey=${accessKey}`).then(function(response){
           console.log("Line 70")
         })
       },seconds)
 
 
     })
   })
})
}

module.exports=router;
