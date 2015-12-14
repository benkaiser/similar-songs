## Similar Songs

This library takes an artist and track title as parameters and using
the youtube, lastfm and itunes APIs returns a list of related songs
and their youtube video ids.

Process is as follows:

1. request similar tracks from lastfm
1. search youtube with that track title and artist and pick the first result to get the youtube video id (fingers crossed it's correct, also if we can't find any videos, just exclude this result)
1. query the itunes api for the album name, disc number, track number and higher resolution cover art (if this fails which it normally does for neiche remixes and such, it just returns without this extra information)

### Usage

```javascript
var similarSongs = require('similar-songs');

similarSongs.find({
  title: 'Title',
  artist: 'Artist',
  limit: 50, // defaults to 50
  lastfmAPIKey: 'YOUR_LASFTM_KEY_HERE',
  lastfmAPISecret: 'YOUR_LASTFM_SECRET_HERE',
  youtubeAPIKey: 'YOUR_YOUTUBE_KEY_HERE',
}, function(err, songs) {
  console.log(songs); // will print out the 50 most similar tracks
});
```

### License

[MIT](https://opensource.org/licenses/MIT)
