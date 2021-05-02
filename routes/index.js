let express = require('express');
let router = express.Router();

let googlelogin=require('../controller/googlelogin')
let fblogin=require('../controller/facebooklogin')


// Getting login URL

 /**
  * @swagger
  * /auth/google/url:
  *  get:
  *    description: use to get the Google Auth URL 
  *    responses:
  *      '200':
  *        
  */
router.get("/auth/google/url", googlelogin.googleauthurl);
router.get("/auth/google",googlelogin.getUserdetails)
 /**
  * @swagger
  * /fb:
  *  get:
  *    description: UI to redirect the user to Facebook's login dialog 
  *    responses:
  *      '200':
  *        
  */
router.get("/fb",fblogin.redirectUserLogin)
router.get("/oauth-redirect",fblogin.generateAcessToken)
router.get("/me",fblogin.userdetails)

module.exports = router;