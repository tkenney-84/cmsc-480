var express = require('express');
var router = express.Router();
var apis = require('../apiBaseUrl');
const { __assign } = require('tslib');
const { default: axios } = require('axios');
router.get('/getAzimuth',function(req,res){

    axios.get(`${api}/get_azimuth?panel=Manually_Controlled`).then(function(response){

        const azimuth = response.data.azimuth


        res.send({azimuth:azimuth,message:"Succesfully Retrived"})

    }).catch(function(err){
        res.send({message:"Unsuccessful",err:err})
    })

})

router.get('/getElevation',function(req,res){

    axios.get(`${api}/get_elevation?panel=Manually_Controlled`).then(function(response){

        const azimuth = response.data.azimuth


        res.send({azimuth:azimuth,message:"Succesfully Retrived"})

    }).catch(function(err){
        res.send({message:"Unsuccessful",err:err})
    })

})
module.exports = router;