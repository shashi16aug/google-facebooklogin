
const axios =require("axios");
const config=require("../config/config.json")

//  UI to redirect the user to Facebook's login dialog
exports.redirectUserLogin= (req, res) => {
    res.send(`
      <html>
        <body>
        <input type="button" value="click to Login by facebook" 
        onclick="location.href = 'https://www.facebook.com/v6.0/dialog/oauth?client_id=214668820106267&redirect_uri=http://localhost:3000/oauth-redirect'" />
        </body>
      </html>
    `).status(200);
  };

  const accessTokens = new Set();

  //  Exchange auth code for access token
  exports.generateAcessToken= async (req, res) => {
    try {
      const authCode = req.query.code;
  
      // Build up the URL for the API request. `client_id`, `client_secret`,
      // `code`, **and** `redirect_uri` are all required. And `redirect_uri`
      // must match the `redirect_uri` in the dialog URL from Route 1.
      const accessTokenUrl = 'https://graph.facebook.com/v6.0/oauth/access_token?' +
        `client_id=${config.client_id}&` +
        `client_secret=${config.client_secret}&` +
        `redirect_uri=${encodeURIComponent('http://localhost:3000/oauth-redirect')}&` +
        `code=${encodeURIComponent(authCode)}`;
  
      // Make an API request to exchange `authCode` for an access token
      const accessToken = await axios.get(accessTokenUrl).then(res => res.data['access_token']);
      // Store the token in memory for now. Later we'll store it in the database.
      console.log('Access token is', accessToken);
      accessTokens.add(accessToken);
  
      res.redirect(`/me?accessToken=${encodeURIComponent(accessToken)}`);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: err.response.data || err.message });
    }
  };

  //  Make requests to FB on behalf of the user
exports.userdetails= async (req, res) => {
    try {
      const accessToken = req.query.accessToken;
      if (!accessTokens.has(accessToken)) {
        throw new Error(`Invalid access token "${accessToken}"`);
      }
  
      // Get the name and user id of the Facebook user associated with the
      // access token.
      const data = await axios.get(`https://graph.facebook.com/me?access_token=${encodeURIComponent(accessToken)}`).
        then(res => res.data);
  
      return res.send(`
        <html>
          <body>
        <h2>  Your name is ${data.name}</h2>
          </body>
        </html>
      `);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: err.response.data || err.message });
    }
  };


