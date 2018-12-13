var express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors');
var busboy = require('connect-busboy');
var responseTime = require('response-time')
var cookieParser = require('cookie-parser');
require('ejs');
require('dotenv').config()

require('./app_api/models/db');
var routesApi = require('./app_api/routes/index')

var app = express();

app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

var corsOptions = {
    credentials: true,
    origin: "*"
}
app.use(cors(corsOptions));

app.use(cookieParser());
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({
    limit: '20mb',
    extended: false
}));
app.use(busboy());
app.use(responseTime())

app.use('/api', routesApi);

app.use('/', function (req, res) {
    res.render('welcome.html');
});

module.exports = app;