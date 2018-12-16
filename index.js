const express = require('express');
const path = require('path');
const axios = require('axios')
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;
const app = express();

const session = require('express-session')

app.use(session({
  secret: 'vimeo-secret',
  resave: false,
  saveUninitialized: true
}))

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

var urlencodedParser = bodyParser.urlencoded({ extended: false});

app.use(express.json() );
app.use(express.urlencoded({ extended: false }));

app.set('port', (process.env.PORT || 5000));

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

app.post('/login', handleLogin);
app.get('/logout', handleLogout)

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

function handleLogin(req, res) {
  var result = {success: false};

  // We should do better error checking here to make sure the parameters are present
  if (req.body.username == "admin" && req.body.password == "cs313") {
    req.session.user = req.body.username;
    result = {success: true};
  }

  res.json(result);
}

function handleLogout(req, res) {
  var result = {success: false};

  if (req.session.user) {
    req.session.destroy();
    result = {success: true};
  }

  res.redirect('/')
}

function verifyLogin(req, res, next) {
  if (req.session.user) {
    // logged in
    next();
  } else {
    // not logged in
    res.render('project2/login')
  }
}

function logRequest(req, res, next) {
  console.log("Received a request for: " + req.url);

  next();
}