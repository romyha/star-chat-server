var mongoose = require('mongoose');

var starSchema = new mongoose.Schema({
    name: { type: String, required: true},
    responseTime: String, 
    price: Number, 
    pic: String,
    description: String,
    greeting: String
});

mongoose.model('Star', starSchema);