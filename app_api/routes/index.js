var express = require('express');
var router = express.Router();

var ctrlStars = require('../controllers/stars');

//stars
router.get('/stars', ctrlStars.starsListAll);
router.post('/stars', ctrlStars.starsCreate);

module.exports = router;