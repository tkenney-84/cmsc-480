var express = require("express");
var router = express.Router();
var axios = require("axios");
var jwt = require("jsonwebtoken");
var captchaSecret = global.captchaSecret;

router.post("/processCaptchaToken", function (req, res, next) {
  axios
    .get(
      `https://challenges.cloudflare.com/turnstile/v0/siteverify?secret=${captchaSecret}&response=${req.body.token}&remoteip=${req.ip}`
    )
    .then((response) => {
      res.send(response.data);
      // if (response.data.success) {

      //   const jwtPayload = {
      //     captchaToken: captchaToken,
      //   };

      //   const jwtString = jwt.sign(jwtPayload, secretKey, { expiresIn: "30m" });

      //   // Send request with JWT in Authorization header
      //   fetch("/your-backend-api", {
      //     method: "POST", // Or your appropriate method
      //     // ... other request settings
      //     headers: {
      //       Authorization: `Bearer ${jwtString}`,
      //     },
      //   });
      //   res.send({
      //     success: true,
      //     message: "CAPTCHA token successfully validated.",
      //   });
      // } else {
      //   res.send({
      //     success: false,
      //     message: "CAPTCHA token validation failed.",
      //   });
      // }
    });
});

module.exports = router;
