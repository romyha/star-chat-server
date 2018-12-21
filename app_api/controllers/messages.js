var mongoose = require('mongoose');
var User = mongoose.model('User');

var sendJsonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.getMessagesFromChat = function (req, res) {
    User.findOne({ email: req.params.email }).select('messages').exec((err, user) => {
        if (!user) {
            sendJsonResponse(res, 404, {
                "message": "user not found"
            });
            return;
        } else if (err) {
            sendJsonResponse(res, 400, err);
            return;
        }

        if (user.messages && user.messages.length > 0) {
            let messagesFromChat = user.messages.filter(msg => msg.recipient === req.params.starid || msg.author === req.params.starid);
            sendJsonResponse(res, 200, messagesFromChat);
        }
    });
};

module.exports.messagesCreate = function (req, res) {
    if (req.params.email && req.body.starid) {
        
        User.findOne({ email: req.params.email }).exec((err, user) => {
            if (err) {
                sendJsonResponse(res, 400, err);
                return;
            } else {
                let message = {
                    author: req.body.user,
                    recipient: req.body.starid,
                    date: Date.now(),
                    content: req.body.message
                };
                user.messages.push(message);
                message = user.messages[user.messages.length - 1];

                user.save(function (err, user) {
                    if (err) {
                        sendJsonResponse(res, 400, err);
                    } else {
                        //io.emit('message', message);
                        sendJsonResponse(res, 201, message);
                    }
                });
            }
        });
    }
}