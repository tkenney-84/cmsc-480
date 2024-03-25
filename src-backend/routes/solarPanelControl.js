var express = require('express');
var router = express.Router();
var apis = require('../apiBaseUrl');
const { default: axios } = require('axios');
const { __assign } = require('tslib');
var host = apis.solarTracker;
var username = process.env.USERNAME_PASSWORD
var password = process.env.USERNAME_PASSWORD
var userType = process.env.USERTYPE

var maximumMovementDuration = 5; // Seconds
var movementDurationBuffer = 1; // Seconds
var maximumSafeMovementDuration = maximumMovementDuration - movementDurationBuffer; // Seconds
var degreesMovedPerSecond = 7; // Degrees. Verified through observation.


router.post('/movePanel',async function(req,res){
  //var movementDirection = req.body.movementDirection
  var direction = req.body.direction
  var duration = req.body.duration
  axios.get(`${host}/get_position?panel=Manually_Controlled`).then(async function(response){

          
    const elevation = response.data.elevation;
    const azimuth = response.data.azimuth;
    axios.get(`${host}/login?username=${username}&password=${password}&usertype=${userType}`).then(function(response){
        var accessKey = response.data.message
        axios.get(`${host}/is_control_user?accesskey=${accessKey}&panel=Manually_Controlled`).then(async function(response){
          console.log(response.data)
          if(direction == "Left"){
            await moveAzimuthBySeconds(duration,true,accessKey)
           }else if(direction === "Right"){
             console.log("line 237")
             await moveAzimuthBySeconds(duration,false,accessKey)
           }else if(direction == "Up"){
           await moveElevationBySeconds(duration,false,accessKey);
           }else if(direction == "Down"){
            await moveElevationBySeconds(duration,true,accessKey);
           }
           res.send({message:"Successfully moved panel"})
         
         
        })
    })
})
 
 
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
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
// function resetElevation() {

//   var defaultElevation = 45; // Degrees
//   var currentElevation;

//   requestCurrentElevation().then(function(response) {

//     currentElevation = response.data.azimuth;

//     var degreesToTravel = defaultElevation - currentElevation;

//     if (degreesToTravel == 0) { // Already at default.
//       return {
//         success:true,
//         message:"Solar panel is already at default elevation."
//       }
//     }

//     var secondsToMove = degreesToTravel / degreesMovedPerSecond;
//     var movesToPerform = Math.floor(secondsToMove / maximumSafeMovementDuration);
//     var finalMoveDuration = secondsToMove % maximumSafeMovementDuration;

//     for (var i = 0; i < movesToPerform; i++) {
//       setTimeout(moveElevationBySeconds(maximumSafeMovementDuration, degreesToTravel < 0), i * maximumSafeMovementDuration);
//     }

//     setTimeout(moveElevationBySeconds(finalMoveDuration, degreesToTravel < 0), movesToPerform * maximumSafeMovementDuration);

//   });
// }
router.post('/reset',function(req,res){
  axios.get(`${host}/get_position?panel=Manually_Controlled`).then(async function(response){

          
    const elevation = response.data.elevation;
    const azimuth = response.data.azimuth;
    axios.get(`${host}/login?username=${username}&password=${password}&usertype=${userType}`).then(function(response){
        var accessKey = response.data.message
        axios.get(`${host}/is_control_user?accesskey=${accessKey}&panel=Manually_Controlled`).then(async function(response){
          if(azimuth < 43 || azimuth > 50){
              await resetAzimuth(45,azimuth,accessKey)
          }if(elevation < 43 || azimuth > 50){
             setTimeout(() => {
          resetElevation(45,elevation,accessKey)
         }, 2000 );
          }
         res.send({Message:"Successfully Reset Panel"})   
        })
    })
})
})

async function resetAzimuth(resetAngle,currentAngle,accessKey){
  var degreesToMove = resetAngle - currentAngle;
  var n;
  var degreesPerSecond = 7
  var panelMoveTime = 4000
  var originalSeconds;
  if(degreesToMove < 0){
   var numSeconds = Math.abs(degreesToMove / parseFloat(7)) * 1000;
   originalSeconds = numSeconds;
    console.log(numSeconds);
    console.log(numSeconds / parseFloat(panelMoveTime));
     n = Math.ceil(numSeconds / parseFloat(panelMoveTime));
    console.log(n)
    let isDone = false
   while(!isDone){
      if (numSeconds < panelMoveTime) {
          var result =await moveAzimuthBySeconds(Math.round(numSeconds),true,accessKey).then(async function(response){
             await sleep(1000)
              isDone = true
       const angle = (Math.round(numSeconds) / 1000) * degreesPerSecond;
        console.log(angle);
          }).catch(function(err){
            return;
          })  
      } else {
        var result =await moveAzimuthBySeconds(panelMoveTime,true,accessKey).then(async function(response){
          await sleep(1000)
          numSeconds = numSeconds - panelMoveTime;
       
       }).catch(function(err){
         return;
       })        
     }
    }
  } else {
    var numSeconds = Math.abs((degreesToMove) / parseFloat(degreesPerSecond))*1000
    console.log(numSeconds);
    if(numSeconds < panelMoveTime){
      n = 1
    }else{
      n=Math.ceil(numSeconds / parseFloat(panelMoveTime))
    }
    console.log(n);
   for(let i =0; i < n; i++){
      if (numSeconds < panelMoveTime) {
        var result =await moveAzimuthBySeconds(Math.round(numSeconds),false,accessKey).then(async function(response){
          await sleep(1000)
          const angle = (numSeconds / 1000) * degreesPerSecond;
        console.log(currentAngle)
        currentAngle = currentAngle + angle;
        console.log(currentAngle)
       }).catch(function(err){
         return;
       }) 
        break;
      } else {
        var result =await moveAzimuthBySeconds(panelMoveTime,false,accessKey).then(async function(response){
          await sleep(1000)
          numSeconds = numSeconds - panelMoveTime;
        currentAngle = currentAngle + ((degreesPerSecond/1000) * panelMoveTime);
       }).catch(function(err){
         return;
       }) 
      }
    }
  }

  return {success:true,numSeconds:originalSeconds} 
}
async function resetElevation(resetAngle,currentAngle,accessKey){
  var degreesToMove = resetAngle - currentAngle;
  var n;
  var degreesPerSecond = 3
  var panelMoveTime = 4000
 
  var originalSeconds;
  if(degreesToMove < 0){
   var numSeconds = Math.abs(degreesToMove / parseFloat(7)) * 1000;
   originalSeconds = numSeconds;
    let isDone = false
   while(!isDone){
      if (numSeconds < panelMoveTime) {
          console.log("LIne 343")
          var result =await moveElevationBySeconds(Math.round(numSeconds),true,accessKey).then(async function(response){
             await sleep(1000)
              isDone = true
       const angle = (Math.round(numSeconds) / 1000) * degreesPerSecond;
        console.log(angle);
          }).catch(function(err){
            return;
          })  
      } else {
        var result =await moveElevationBySeconds(panelMoveTime,true,accessKey).then(async function(response){
          await sleep(1000)
          numSeconds = numSeconds - panelMoveTime;
       
       }).catch(function(err){
         return;
       })        
     }
    }
  } else {
    var numSeconds = Math.abs((degreesToMove) / parseFloat(degreesPerSecond))*1000
    console.log(numSeconds);
    if(numSeconds < panelMoveTime){
      n = 1
    }else{
      n=Math.ceil(numSeconds / parseFloat(panelMoveTime))
    }
    console.log(n);
   for(let i =0; i < n; i++){
      if (numSeconds < panelMoveTime) {
        console.log("Line 381")
        var result =await moveElevationBySeconds(Math.round(numSeconds),false,accessKey).then(async function(response){
          await sleep(1000)
          const angle = (numSeconds / 1000) * degreesPerSecond;
        console.log(currentAngle)
        currentAngle = currentAngle + angle;
        console.log(currentAngle)
       }).catch(function(err){
         return;
       }) 
        break;
      } else {
        var result =await moveElevationBySeconds(panelMoveTime,false,accessKey).then(async function(response){
          await sleep(1000)
          numSeconds = numSeconds - panelMoveTime;
        currentAngle = currentAngle + ((degreesPerSecond/1000) * panelMoveTime);
       }).catch(function(err){
         return;
       }) 
      }
    }
  }

  return {success:true,numSeconds:originalSeconds} 
}
router.post('/moveElevation',function(req,res){
  var angleToMove = req.body.angle
  axios.get(`${host}/login?username=${username}&password=${password}&usertype=${userType}`).then(function(response){
    var accessKey = response.data.message
    axios.get(`${host}/is_control_user?accesskey=${accessKey}&panel=Manually_Controlled`).then(async function(response){
     
     axios.get(`${host}/move_elevation&elevation=${angleToMove}&accesskey=${accessKey}&panel=Manually_Controlled`).catch(function(err){
      console.log("Err: " + err)
     })
     
    }).catch(function(err){
      console.log("Err: " + err)
    })
})

})
// function resetAzimuth() {

//   var defaultAzimuth = 45; // Degrees
//   var currentAzimuth;

//   requestCurrentAzimuth().then(function(response) {

//     currentAzimuth = response.data.azimuth;

//     var degreesToTravel = defaultAzimuth - currentAzimuth;

//     if (degreesToTravel == 0) { // Already at default.
//       return {
//         success:true,
//         message:"Solar panel is already at default azimuth."
//       }
//     }

//     var secondsToMove = degreesToTravel / degreesMovedPerSecond;
//     var movesToPerform = Math.floor(secondsToMove / maximumSafeMovementDuration);
//     var finalMoveDuration = secondsToMove % maximumSafeMovementDuration;

//     for (var i = 0; i < movesToPerform; i++) {
//       setTimeout(() => { moveAzimuthBySeconds(maximumSafeMovementDuration, degreesToTravel < 0) }, i * maximumSafeMovementDuration);
//     }

//     setTimeout(() => { moveAzimuthBySeconds(finalMoveDuration, degreesToTravel < 0) }, movesToPerform * maximumSafeMovementDuration);

//   });
// }

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




 function moveAzimuthBySeconds(seconds, moveLeft,accessKey) {
  return new Promise(async (resolve,reject) =>{
    try{
      var direction = "Right"
      if(moveLeft){
        direction = "Left"
      }
      console.log(direction)
      const startElevationUrl = `${host}/start_azimuth?panel=Manually_Controlled&accesskey=${accessKey}&direction=${direction}`;
      const stopElevationUrl = `${host}/stop_azimuth?panel=Manually_Controlled&accesskey=${accessKey}`;

      const startResponse = await axios.get(startElevationUrl);

      await sleep(seconds);

      const stopResponse = await axios.get(stopElevationUrl);
     
      resolve({ success: true });
    }catch(err){
      console.log("Err : " + err);
      reject({ success: false, error: err, numSeconds: 0 });
    }
  })
 
  
}
function moveElevationBySeconds(seconds, moveDown, accessKey) {
  return new Promise(async (resolve, reject) => {
    try {
      var direction = "Up";
      if (moveDown) {
        direction = "Down";
      }

      const startElevationUrl = `${host}/start_elevation?panel=Manually_Controlled&accesskey=${accessKey}&direction=${direction}`;
      const stopElevationUrl = `${host}/stop_elevation?panel=Manually_Controlled&accesskey=${accessKey}`;

      const startResponse = await axios.get(startElevationUrl);

      await sleep(seconds);

      const stopResponse = await axios.get(stopElevationUrl);

      resolve({ success: true });
    } catch (err) {
      console.log("Line 365");
      console.log("Err : " + err);
      reject({ success: false, error: err, numSeconds: 0 });
    }
  });
}



module.exports=router;
