var express = require("express");
var router = express.Router();
var axios = require('axios');
var jwt = require("jsonwebtoken");
var captchaSecret = global.captchaSecret;

router.post("/processCaptchaToken", function (req, res, next) {
  axios
    .post(
      `https://challenges.cloudflare.com/turnstile/v0/siteverify`,
      {
        response: req.body.token,
        secret: captchaSecret,
        remoteip: req.ip,
      }
    )
    .then((response) => {
      if (response.data.success) {

        const jwtPayload = {
          captchaToken: req.body.token,
        };

        const jwtString = jwt.sign(jwtPayload, captchaSecret, { expiresIn: "30m" });

        res.send({
          success: true,
          message: "CAPTCHA token successfully validated.",
          data: jwtString,
        });

      } else {
        res.send({
          success: false,
          message: "CAPTCHA token validation failed.",
          data: null,
        });
      }
    });
});

module.exports = router;
