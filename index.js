const express = require('express');
const path = require('path');
const axios = require('axios')
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;
var app = express();


var session = require('express-session')

app.use(session({
  secret: 'vimeo-secret',
  resave: false,
  saveUninitialized: true
}))

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

var urlencodedParser = bodyParser.urlencoded({ extended: false});

app.use(express.json() );       // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: false })); // to support URL-encoded bodies

app.set('port', (process.env.PORT || 5000));

// We have html and js in the public directory that need to be accessed
app.use(express.static(path.join(__dirname, 'public')))


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


app.get('/', verifyLogin, (req, res) => {
    getGenres()
    .then(response => {
      res.render('project2/index', {data: response['data']['data']})
    })
    .catch(error => {
      res.send("fail" + error)
    })
  })

app.get('/genres/:id', verifyLogin, (req, res) => {
    getGenre(req.params.id)
    .then(response => {
      const data = [];
      response['data']['data'].forEach(item => {data.push(item)});

      data.forEach(item => {
          // Creating the poster and background image of dimensions 250 by 375
          let pictures = item.pictures.uri;
          item.pictures = "https://i.vimeocdn.com/vod_poster" + pictures.substring(pictures.lastIndexOf("/"));

          // Reducing the description to 40 words
          item.description = item.description.split(" ").splice(0,40).join(" ") + "...";
      });
      res.render('project2/genres', {data: data, selected: req.params.id})
    })
    .catch(error => {
      res.send("fail" + error)
    })})

app.get('/login', (req, res) => {
  res.render('project2/login')
});

// Setup our routes
app.post('/login', handleLogin);
app.get('/logout', handleLogout)
// app.post('/logout', handleLogout);

function getGenres() {
  try {
    return axios.get('https://api.vimeo.com/ondemand/genres?access_token=675158fe38a61d2601b865875b53d506&fields=name,canonical')
  } catch (error) {
    console.error(error)
  }
}  

function getGenre(genre) {
  try {
    return axios.get('https://api.vimeo.com/ondemand/genres/' + genre + '/pages/?access_token=675158fe38a61d2601b865875b53d506&fields=name,description,link,colors,pictures.uri')
  } catch (error) {
    console.error(error)
  }
}

function handleLogin(request, response) {
  var result = {success: false};

  // We should do better error checking here to make sure the parameters are present
  if (request.body.username == "admin" && request.body.password == "cs313") {
    request.session.user = request.body.username;
    result = {success: true};
  }

  response.json(result);
}

function handleLogout(request, response) {
  var result = {success: false};

  // We should do better error checking here to make sure the parameters are present
  if (request.session.user) {
    request.session.destroy();
    result = {success: true};
  }

  // response.json(result);
  response.redirect('/')
}

function verifyLogin(request, response, next) {
  if (request.session.user) {
    // logged in
    next();
  } else {
    // not logged in
    response.render('project2/login')
  }
}

// This middleware function simply logs the current request to the server
function logRequest(request, response, next) {
  console.log("Received a request for: " + request.url);

  // don't forget to call next() to allow the next parts of the pipeline to function
  next();
}