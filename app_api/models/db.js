require('./stars');

var mongoose = require('mongoose');

var dbURI = 'mongodb://localhost:27017/star-chat';

if (process.env.NODE_ENV === 'production') {
    dbURI = 'mongodb://' + process.env.STAR_CHAT_MONGODB_PORT_27017_TCP_ADDR + ':' + process.env.STAR_CHAT_MONGODB_PORT_27017_TCP_PORT + process.env.STAR_CHAT_MONGODB_NAME;
} else if (process.env.NODE_ENV === 'test') {
    dbURI = 'mongodb://localhost:27017/star-chat-test';
}

mongoose.connect(dbURI);

mongoose.connection.on('connected', function () {
    debug('Mongoose connected to %s', dbURI);
});

mongoose.connection.on('error', function (err) {
    debug('Mongoose connection error: ', err);
});

mongoose.connection.on('disconnected', function () {
    debug('Mongoose disconnected');
});

var gracefulShutdown = function (message, callback) {
    mongoose.connection.close(function () {
        debug('Mongoose disconnected through ', message);
        callback();
    });
};

// for nodemon restarts
process.once('SIGUSR2', function () {
    gracefulShutdown('nodemon restart', function () {
        process.exit(0);
    });
});

// for app closing
process.on('SIGINT', function () {
    gracefulShutdown('app termination', function () {
        process.exit(0);
    });
});

// for heroku app closing
process.on('SIGTERM', function () {
    gracefulShutdown('Heroku app shutdown', function () {
        process.exit(0);
    });
});