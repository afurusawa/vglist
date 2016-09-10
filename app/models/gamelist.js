var mongoose = require('mongoose');

var gameListItemSchema = mongoose.Schema({
    gameId         : mongoose.Schema.Types.ObjectId,
    gameName       : String,
    rating         : { type: Number, min: 0, max: 100, default: 0 },
    completed      : { type: Number, default: 0 },
    hoursPlayed    : { type: Number, default: 0 }
});

var gameListSchema = mongoose.Schema({
    userId  : mongoose.Schema.Types.ObjectId,
    username : String,
    gameList : [gameListItemSchema]
});

module.exports = mongoose.model('GameList', gameListSchema);