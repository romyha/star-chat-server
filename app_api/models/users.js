var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var messageSchema = new mongoose.Schema({
    author: { type: String, required: true},
    content: String, 
    date: Date,
    recipient: { type: String, required: true}
}, { usePushEach: true });

var userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    hash: String,
    salt: String,
    messages: { type: [messageSchema], index: true },
    starId: String
}, { usePushEach: true });

userSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex'); // create random string for salt
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex'); // create encrypted hash
};

userSchema.methods.validPassword = function (password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    return this.hash === hash;
}

userSchema.methods.generateJwt = function () {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7); // set it for 7 days

    return jwt.sign({
        _id: this._id, // pass payload
        email: this.email,
        name: this.name,
        exp: parseInt(expiry.getTime() / 1000) // iclude exp as Unix time in seconds
    }, process.env.AUTH_SECRET); // send secret for hashing algorithm to use
}

userSchema.index({ email: 1, type: -1 });
mongoose.model('User', userSchema);