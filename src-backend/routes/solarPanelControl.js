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
         await resetAzimuth(45,azimuth,accessKey)
       await sleep(2000)
          await resetElevation(45,elevation,accessKey)
        
         
        })
    })
   
  
      
    
    

})
  



})
// async function reset2(resetAngle,currentAngle,isAzimuth,accessKey){

//   var degreesToMove = resetAngle - currentAngle;
//   var n;
//   var originalSeconds;
//   if(degreesToMove < 0){
//    var numSeconds = Math.abs(degreesToMove / parseFloat(7)) * 1000;
//    originalSeconds = numSeconds;
//     console.log(numSeconds);
//     console.log(numSeconds / parseFloat(4000));
//      n = Math.ceil(numSeconds / parseFloat(4000));
  
//     for (let i = 0; i < n ; i++) {
//       if (numSeconds < 4000) {
//         const angle = (numSeconds / 1000) * 7;
//         if(isAzimuth){
//           var result =await moveAzimuthBySeconds(Math.round(numSeconds),true,accessKey) 
//           if(!result.success){
//             return result;
//           }
          
//         }else{
//           var result =await moveElevationBySeconds(Math.round(numSeconds),true,accessKey) 
//           if(!result.success){
//             return result;
//           }
//         }
//         await sleep(2000)
//         console.log(angle);
//         currentAngle = currentAngle - angle;
//       } else {
//         if(isAzimuth){
//           var result =await moveAzimuthBySeconds(4000,true,accessKey) 
//           if(!result.success){
//             return result;
//           }
          
//         }else{
//           var result =await moveElevationBySeconds(4000,true,accessKey) 
//           if(!result.success){
//             return result;
//           }
//         }
//         numSeconds = numSeconds - 4000;
//         currentAngle = currentAngle - 28;
//         await sleep(2000)
       
//       }
//     }
//   } else {
//     var numSeconds = Math.abs((degreesToMove* 1000) / parseFloat(7000)) 
  
//     console.log(numSeconds);
//     if(numSeconds < 4000){
//       n = 1
//     }else{
//       n = Math.floor(numSeconds / parseFloat(4000));
//     }
     
 
//     console.log(n);
//     for (let i = 0; i < n; i++) {
//       console.log(i + " " + numSeconds + " " + currentAngle);
//       if (numSeconds < 4000) {
//         if(isAzimuth){
//           var result =await moveAzimuthBySeconds(Math.round(numSeconds),false,accessKey) 
//           if(!result.success){
//             return result;
//           }
          
//         }else{
//           var result =await moveElevationBySeconds(Math.round(numSeconds),false,accessKey) 

//           if(!result.success){
//             return result;
//           }
//         }
//         await sleep(2000)
//         const angle = (numSeconds / 1000) * 7;
//         console.log(currentAngle)
//         currentAngle = currentAngle + angle;
//       } else {
//         if(isAzimuth){
//           var result =moveAzimuthBySeconds(4000,false,accessKey) 
//           if(!result.success){
//             return result;
//           }
          
//         }else{
//           var result =moveElevationBySeconds(4000,false,accessKey) 
//           if(!result.success){
//             return result;
//           }
//         }
//         numSeconds = numSeconds + 4000;
//         currentAngle = currentAngle + 28;
//         await sleep(2000)
//       }
//     }
//   }
//   console.log(Math.round(currentAngle));
//   return {success:true,numSeconds:originalSeconds} 


// }
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
   while(currentAngle != resetAngle){
      if (numSeconds < panelMoveTime) {
        
        
          var result =await moveAzimuthBySeconds(Math.round(numSeconds),true,accessKey).then(async function(response){
             await sleep(1000)
            
       const angle = (Math.round(numSeconds) / 1000) * degreesPerSecond;
        console.log(angle);
        currentAngle = currentAngle - angle;
          }).catch(function(err){
            return;
          }) 
        
         break;
      } else {
        
        var result =await moveAzimuthBySeconds(panelMoveTime,true,accessKey).then(async function(response){
          await sleep(1000)
          numSeconds = numSeconds - panelMoveTime;
        currentAngle = currentAngle - ((panelMoveTime/1000) * degreesMovedPerSecond);
       }).catch(function(err){
         return;
       }) 
      
       
       
      }
    }
  } else {
    var numSeconds = Math.abs((degreesToMove) / parseFloat(3))*1000
    console.log(numSeconds);
    if(numSeconds < panelMoveTime){
      n = 1
    }else{
      n=Math.floor(numSeconds / parseFloat(4000))
    }
   for(let i =0; i < n; i++){
      //console.log(i + " " + numSeconds + " " + currentAngle);
      if (numSeconds > panelMoveTime) {
     
        var result =await moveAzimuthBySeconds(Math.round(numSeconds),true,accessKey).then(async function(response){
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
        
        var result =await moveAzimuthBySeconds(panelMoveTime,true,accessKey).then(async function(response){
          await sleep(1000)
          numSeconds = numSeconds + panelMoveTime;
        currentAngle = currentAngle + ((degreesPerSecond/1000) * panelMoveTime);
       }).catch(function(err){
         return;
       }) 
      
        
        
      }
    }
  }
  console.log(Math.round(currentAngle));
  return {success:true,numSeconds:originalSeconds} 
}
async function resetElevation(resetAngle,currentAngle,accessKey){
  var degreesToMove = resetAngle - currentAngle;
  var n;
  var degreesPerSecond = 3
  var panelMoveTime = 4000
 
  var originalSeconds;
  if(degreesToMove < 0){
   var numSeconds = Math.abs(degreesToMove / parseFloat(degreesPerSecond)) * 1000;
   originalSeconds = numSeconds;
    console.log(numSeconds);
    console.log(numSeconds / parseFloat(panelMoveTime));
     n = Math.ceil(numSeconds / parseFloat(panelMoveTime));
    console.log(n)
   while(currentAngle != resetAngle){
      if (numSeconds < panelMoveTime) {
        
        
          var result =await moveElevationBySeconds(Math.round(numSeconds),true,accessKey).then(async function(response){
             await sleep(1000)
            
       const angle = (Math.round(numSeconds) / 1000) * degreesPerSecond;
        console.log(angle);
        currentAngle = currentAngle - angle;
          }).catch(function(err){
            return;
          }) 
        
         break;
      } else {
        
        var result =await moveElevationBySeconds(panelMoveTime,true,accessKey).then(async function(response){
          await sleep(1000)
          numSeconds = numSeconds - panelMoveTime;
        currentAngle = currentAngle - ((panelMoveTime/1000) * degreesMovedPerSecond);
       }).catch(function(err){
         return;
       }) 
      
       
       
      }
    }
  } else {
    var numSeconds = Math.abs((degreesToMove) / parseFloat(3))*1000
  
    console.log(numSeconds);
    if(numSeconds < panelMoveTime){
      n = 1
    }else{
      n=Math.floor(numSeconds / parseFloat(4000))
    }
   for(let i =0; i < n; i++){
    
      //console.log(i + " " + numSeconds + " " + currentAngle);
      if (numSeconds > panelMoveTime) {
     
        var result =await moveElevationBySeconds(Math.round(numSeconds),false,accessKey).then(async function(response){
          await sleep(1000)
          const angle = (numSeconds / 1000) * degreesPerSecond;
        console.log(currentAngle)
        currentAngle = currentAngle + angle;
        console.log(currentAngle)
       }).catch(function(err){
         return;
       }) 
      } else {
        
        var result =await moveElevationBySeconds(panelMoveTime,false,accessKey).then(async function(response){
          await sleep(1000)
          numSeconds = numSeconds + panelMoveTime;
        currentAngle = currentAngle + ((degreesPerSecond/1000) * panelMoveTime);
       }).catch(function(err){
         return;
       }) 
      
        
        
      }
    }
  }
  console.log(Math.round(currentAngle));
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
