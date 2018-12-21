var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
    secret: process.env.AUTH_SECRET,
    userProperty: 'payload'
});

var ctrlAuth = require('../controllers/authentication');

var ctrlStars = require('../controllers/stars');
var ctrlMessages = require('../controllers/messages');

//authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);
router.get('/loginsncn', ctrlAuth.loginWithSncn);
router.get('/callback', ctrlAuth.callback);

//stars
router.get('/stars', auth, ctrlStars.starsListAll);
router.post('/stars', auth, ctrlStars.starsCreate);

//messages
router.get('/user/:email/messages/:starid', auth, ctrlMessages.getMessagesFromChat);
router.post('/user/:email/messages', auth, ctrlMessages.messagesCreate);

module.exports = router;