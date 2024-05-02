const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).send(`
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #333; /* dark gray background */
          }
          .message {
            color: #fff; /* white text color */
            font-size: 36px;
            font-weight: bold;
          }
          .message a:link, .message a:visited { /* added this to target the link */
            color: #0074D9; /* blue link color */
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="message">
          🚀 Welcome to the Handiwork API!<br>
          Please visit  <a href="https://handiwork-api.onrender.com/api/v1/docs/">/docs</a> to see the documentation 📚<br> and test the endpoints
        </div>
      </body>
    </html>
  `);
});

module.exports = router;
