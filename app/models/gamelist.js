var mongoose = require('mongoose');

var gameListItemSchema = mongoose.Schema({
    gameId         : { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
    gameName       : String,
    rating         : { type: Number, min: 0, max: 100, default: 0 },
    completed      : { type: Number, default: 0 },
    hoursPlayed    : { type: Number, default: 0 },
    playingNow     : { type: Boolean, default: false }
});

var gameListSchema = mongoose.Schema({
    userId  : mongoose.Schema.Types.ObjectId,
    username : String,
    gameList : [gameListItemSchema]
});

module.exports = mongoose.model('GameList', gameListSchema);