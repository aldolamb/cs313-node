const express = require('express')
const path = require('path')
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;
var app = express();

var urlencodedParser = bodyParser.urlencoded({ extended: false});

app
  .use(express.static(path.join(__dirname, 'public')))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/week09', (req, res) => res.render('pages/Week09'))
  .post('/getRate', (req, res) => res.render('pages/getRate', {details:req.body,}))
  // .post('/getRate', (req, res) => res.render('pages/getRate', {name: req.body.name,}))
  // .get('/getRate', (req, res) => console.log("test"))
  // .post('/test', (req, res) => console.log("test"))
  // .post('/getRate', (req, res) => console.log(req.body))
   // req.body object has your form values
   // console.log(req.body.clubname);
   // console.log(req.body.clubtype);
   // )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

