var mongoose = require('mongoose');
var Star = mongoose.model('Star');

var sendJsonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.starsListAll = function (req, res) {
    Star.find().lean().exec(function (err, stars) {
        if (err) {
            sendJsonResponse(res, 404, err);
        } else {
            sendJsonResponse(res, 200, stars);
        }
    });
};

module.exports.starsCreate = function (req, res) {
    console.log(req.body, req.params);
    Star.create({
        name: req.body.name,
        responseTime: req.body.responseTime,
        price: req.body.price,
        description: req.body.description,
        greeting: req.body.greeting,
        pic: req.body.pic
    }, function (err, star) {
        if (err) {
            sendJsonResponse(res, 400, err);
        } else {
            sendJsonResponse(res, 200, star);
        }
    });
}

module.exports.starsDeleteOne = function (req, res) {
    if (req.params && req.params.name) {
        Star.findOne({
            name: req.params.name
        }, function (err, star) {
            if (err) {
                sendJsonResponse(res, 400, err);
                return;
            }
            Star.findByIdAndRemove(star._id).exec(function (err, star) {
                if (err) {
                    sendJsonResponse(res, 400, err);
                } else {
                    
                    sendJsonResponse(res, 204, null);
                }
            });
        });
    } else {
        sendJsonResponse(res, 404, { "message": "No star name specified" });
    }
}