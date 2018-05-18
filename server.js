const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');

// Run the app by serving the static files in the dist directory
app.use(express.static(__dirname + '/dist', {
  redirect: false
}));

// rewrite virtual urls to angular app to enable refreshing of internal pages
router.get('/*', function (req, res, next) {
    console.log('path join', path.join(__dirname, '/dist/index.html'));
    
  res.sendFile(path.join(__dirname, '/dist/index.html'))
})


// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
