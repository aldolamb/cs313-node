const express = require('express');
const path = require('path');
const axios = require('axios')
// const routes = require('./routes/index');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

var urlencodedParser = bodyParser.urlencoded({ extended: false});


const getGenres = () => {
  try {
    return axios.get('https://api.vimeo.com/ondemand/genres?access_token=675158fe38a61d2601b865875b53d506&fields=name,canonical')
  } catch (error) {
    console.error(error)
  }
}  

const getGenre = (genre) => {
  try {
    return axios.get('https://api.vimeo.com/ondemand/genres/' + genre + '/pages/?access_token=675158fe38a61d2601b865875b53d506&fields=name,description,link,colors,pictures.uri')
  } catch (error) {
    console.error(error)
  }
}

app
  .use(express.static(path.join(__dirname, 'public')))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => {
    getGenres()
    .then(response => {
      res.render('project2/index', {data: response['data']['data']})
    })
    .catch(error => {
      res.send("fail" + error)
    })
  })
  .get('/genres/:id', (req, res) => {
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
      res.render('project2/genres', {data: data, selected: genres[req.params.id]})
    })
    .catch(error => {
      res.send("fail" + error)
    })})
  .post('/getRate', (req, res) => res.render('pages/getRate', {details:req.body,}))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))



  // .get('/categories/:id', (req, res) => res.render('project2/categories', {details: req.params.id}))
  // .get('/week09', (req, res) => {console.log("did it"); res.render('pages/Week09')})
  // .get('/project2', (req, res) => res.render('project2/index'))
  // .post('/getRate', (req, res) => res.render('pages/getRate', {name: req.body.name,}))
  // .get('/getRate', (req, res) => console.log("test"))
  // .post('/test', (req, res) => console.log("test"))
  // .post('/getRate', (req, res) => console.log(req.body))
   // req.body object has your form values
   // console.log(req.body.clubname);
   // console.log(req.body.clubtype);
   // )
