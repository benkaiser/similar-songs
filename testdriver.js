// this file is simply a driver used to test the orchestrate from the command line
// USAGE: node app.js 'lastfm api key' 'lastfm api secret' 'youtube api key' 'track title' 'track artist'
var similarSongs = require('./main.js');

if (process.argv.length < 7) {
  console.log('not enough arguments!');
} else {
  var lastfmAPIKey = process.argv[2];
  var lastfmAPISecret = process.argv[3];
  var youtubeAPIKey = process.argv[4];
  var title = process.argv[5];
  var artist = process.argv[6];

  // print the args out
  console.log('Searching for similar tracks...');
  console.log('Title: ' + title);
  console.log('Artist: ' + artist);

  similarSongs.find({
    title: title,
    artist: artist,
    limit: 50, // defaults to 50
    lastfmAPIKey: lastfmAPIKey,
    lastfmAPISecret: lastfmAPISecret,
    youtubeAPIKey: youtubeAPIKey,
  }, function(err, songs) {
    console.log([err, songs]);
    console.log('Done');
  });
}
