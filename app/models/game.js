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

/*

 Calculating Rating:

 Each time someone either rates or unrates a game on their end, the value is added or removed from the array. When a user views the page, the rating average is calculated using this array.


 Release Year:

 The release year will be the first year it was released on any platform. For example, if the game came out on xbox in 2002, but on PC in 2004, the release year will be 2002.

 */