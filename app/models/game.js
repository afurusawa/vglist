var mongoose = require('mongoose');

var gameSchema = mongoose.Schema({

    title       : String,
    series      : String,
    platform    : [String],
    released    : Date,
    developer   : String,
    publisher   : String,

    metadata : {
        userRating      : [Number],
        criticRating    : [Number]
    }
});

module.exports = mongoose.model('Game', gameSchema);