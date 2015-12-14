var YouTube = require('youtube-node');
var LastFmNode = require('lastfm').LastFmNode;
var async = require('async');
var searchitunes = require('searchitunes');

var youtube = new YouTube();
var lfm = null;

module.exports.find = function find(options, callback) {
  var internalOpts = {
    title: options.title || '',
    artist: options.artist || '',
    limit: options.limit || 50,
    lastfmAPIKey: options.lastfmAPIKey,
    lastfmAPISecret: options.lastfmAPISecret,
    youtubeAPIKey: options.youtubeAPIKey,
  };

  // init youtube and lastfm
  youtube.setKey(internalOpts.youtubeAPIKey);

  lfm = new LastFmNode({
    api_key: internalOpts.lastfmAPIKey,
    secret: internalOpts.lastfmAPISecret,
  });
  var call = 0;

  // search for similar tracks
  lfm.request('track.getSimilar', {
    track: internalOpts.title,
    artist: internalOpts.artist,
    limit: internalOpts.limit,
    handlers: {
      success: function(result) {
        if (!result || !result.similartracks || !result.similartracks.track || result.similartracks.track.length === 0) {
          callback(null, []);
        } else {
          async.map(result.similartracks.track, findYoutubeURLForTrack, function(err, results) {
            if (err) {
              callback(err, null);
            } else {
              // filter out any null values (songs we couldn't find youtube videos for)
              async.filter(results, function(item, cb) {
                cb(item != null);
              }, function(results) {
                // finally add the album + other itunes info to track
                async.map(results, findTrackAlbumForTrack, function(err, results) {
                  callback(null, results);
                });
              });
            }
          });
        }
      },

      error: function(error) {
        callback(error, null);
      },
    },
  });
};

function findYoutubeURLForTrack(trackObj, callback) {
  youtube.search(trackObj.name + ' ' + trackObj.artist.name, 1, function(error, result) {
    if (error || result.items.length === 0) {
      callback(error, null);
    } else {
      var firstRes = result.items[0];
      var obj = {
        title: trackObj.name,
        artist: trackObj.artist.name,
        youtubeId: firstRes.id.videoId,
        coverUrl: getBiggestImage(trackObj.image),
      };

      callback(null, obj);
    }
  });
};

function findTrackAlbumForTrack(track, callback) {
  searchitunes({
    country: 'US',
    term: track.title + ' ' + track.artist,
    limit: 1,
  },

  function(err, data) {
    if (err) {
      // we failed to find the track, return it's default info
      callback(null, track);
    } else {
      if (data.resultCount === 1) {
        track.album = data.results[0].collectionName;
        track.discNumber = data.results[0].discNumber;
        track.trackNumber = data.results[0].trackNumber;
        track.genre = data.results[0].primaryGenreName;
        track.coverUrl = data.results[0].artworkUrl100.replace('100x100', '600x600');
      }

      callback(null, track);
    }
  }
);
};

function getBiggestImage(imageArr) {
  var biggestImg = null;
  var map = [];
  for (index in imageArr) {
    map[imageArr[index].size || 'default'] = imageArr[index]['#text'];
  }

  return map.mega || map.extralarge || map.large || map.medium || map.small || map.default;
}
