var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var sendJsonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.register = function (req, res) {
    if (!req.body.name || !req.body.email || !req.body.password) {
        sendJsonResponse(res, 400, {
            "message": "All fields required"
        });
        return;
    }

    var user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.setPassword(req.body.password);
    user.save(function (err) {
        var token;
        if (err) {
            sendJsonResponse(res, 404, err);
        } else {
            token = user.generateJwt();
            sendJsonResponse(res, 200, {
                "token": token
            });
        }
    });
};

module.exports.login = function (req, res) {
    if (!req.body.email || !req.body.password) {
        sendJsonResponse(res, 400, {
            "message": "All fields required"
        });
        return;
    }

    passport.authenticate('local', function (err, user, info) { // pass name of strategy & callback
        console.log('authenticationg');
        var token;

        if (err) {
            sendJsonResponse(res, 404, err);
            return;
        }

        if (user) {
            token = user.generateJwt(); // if passport returned user instance, generate and send JWT
            sendJsonResponse(res, 200, {
                "token": token
            });
        } else {
            sendJsonResponse(res, 401, info); // otherwise return info message why auth failed
        }
    })(req, res); // call authenticate with req, res
};

module.exports.loginWithSncn = function (req, res) {
    passport.authenticate('openidconnect')(req, res); // call authenticate with req, res
};

module.exports.callback = function (req, res, next) {
    passport.authenticate('openidconnect', function (err, profile, jwt) {
        res.render('callback.html', { jwt: jwt });
    })(req, res, next);
};
