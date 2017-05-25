var mongoose = require('mongoose');

var YTPlaylistSchema = mongoose.Schema({
    name:String,
    link:String,
    embedded:String
});
var BracketSchema = mongoose.Schema({
    name:String,
    link:String
});

var Bracket = mongoose.model('Bracket', BracketSchema);
var YTPlaylist = mongoose.model('YTPlaylist', YTPlaylistSchema);

var TournamentSchema = mongoose.Schema({
    name: String,
    date: Date,
    description: [String],
    brackets: [BracketSchema],
    ytplaylists: [YTPlaylistSchema]
});

module.exports =
{
    Tournament: mongoose.model('Tournament', TournamentSchema, 'tournaments'),
    Bracket: Bracket,
    YTPlaylist: YTPlaylist
};