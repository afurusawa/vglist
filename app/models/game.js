var mongoose = require('mongoose');

var gameSchema = mongoose.Schema({

    title       : String,
    series      : String,
    platform    : [String],
    released    : Date,
    developer   : String,
    publisher   : String,
    //img         : { data: Buffer, contentType: String },
    //player     : { type: mongoose.Schema.Types.ObjectId, ref: 'GameList' },


    metadata : {
        userRating          : { type: Number, min: 0, max: 100, default: 0 },
        userRatingCount     : { type: Number, min: 0, default: 0 },
        criticRating        : { type: Number, min: 0, max: 100, default: 0 },
        criticRatingCount   : { type: Number, min: 0, default: 0 }
    }
});

module.exports = mongoose.model('Game', gameSchema);

/*

 Calculating Rating:

 Each time someone either rates or unrates a game on their end, the value is recalculated with the following formula, which should calculate the new average:

 (userRating * userRatingCount) + newRating
 --- divided by ---
 userRatingCount + 1


 which becomes:

 total = userRating * userRatingCount
 total = total + ratingToAdd
 count = UserRatingCount + 1

 new avg = total / count


 So to reverse it:

 (userRating * userRatingCount) - ratingToRemove
 --- divided by ---
 userRating - 1




 Release Year:

 The release year will be the first year it was released on any platform. For example, if the game came out on xbox in 2002, but on PC in 2004, the release year will be 2002.

 */