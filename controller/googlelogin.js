const express= require( "express");
const app=express()
const axios =require("axios");
const  querystring = require("querystring");
const jwt = require('jsonwebtoken')
const config=require('../config/config.json')

const redirectURI = "auth/google";
/**
 * function to generate google auth url
 * 
 */
function getGoogleAuthURL() {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  console.log(rootUrl)
  const options = {
    redirect_uri: `${'http://localhost:3000'}/${redirectURI}`,
    client_id: config.clientId,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };

  return `${rootUrl}?${querystring.stringify(options)}`;
}


exports.googleauthurl= (req, res) => {
  
var red_url=getGoogleAuthURL();

 res.send(`
    <html>
      <body>
      <input type="button" value="Click to login by Google" 
        onclick="location.href = '${red_url}'" />
      </body>
    </html>
  `);
};


function getTokens(_a) {
    var code = _a.code, clientId = _a.clientId, clientSecret = _a.clientSecret, redirectUri = _a.redirectUri;
    /*
     * Uses the code to get tokens
     * that can be used to fetch the user's profile
     */
    var url = "https://oauth2.googleapis.com/token";
    var values = {
        code: code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
    };
    return axios
        .post(url, querystring.stringify(values), {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    })
        .then(function (res) { return res.data; })
        .catch(function (error) {
        console.error("Failed to fetch auth tokens");
        throw new Error(error.message);
    });
  }
  // Getting the user from Google with the code
  exports.getUserdetails= async (req, res) => {
    const code = req.query.code 
  
    const { id_token, access_token } = await getTokens({
      code,
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      redirectUri: `${'http://localhost:3000'}/${redirectURI}`,
    });
  
    // Fetch the user's profile with the access token and bearer
    const googleUser = await axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
        {
          headers: {
            Authorization: `Bearer ${id_token}`,
          },
        }
      )
      .then((res) => {
          return res.data
        })
      .catch((error) => {
        console.error(`Failed to fetch user`);
        throw new Error(error.message);
      });
  
    const token = jwt.sign(googleUser, "hiii");
  
    res.cookie("auth_token", token, {
      maxAge: 900000,
      httpOnly: true,
      secure: false,
    });
 
    console.log(googleUser)
    return res.send(`
        <html>
          <body>
          <h2>Your name is ${googleUser.name}</h2>
          <h2>Your email is ${googleUser.email}</h2>
          </body>
        </html>
      `);
   
  };
  
  
