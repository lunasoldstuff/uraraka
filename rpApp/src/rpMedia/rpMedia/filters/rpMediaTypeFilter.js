(function () {
  'use strict';

  function rpMediaTypeFilter() {
    return function (url) {
      /*
      Determine the media type.
      */
      const IMGUR_RE =
        /^https?:\/\/(?:i\.|m\.|edge\.|www\.)*imgur\.com\/(?:r\/[\w]+\/)*(?!gallery)(?!removalrequest)(?!random)(?!memegen)([\w]{5,7}(?:[&,][\w]{5,7})*)(?:#\d+)?[sbtmlh]?(\.(?:jpe?g|gif|png|gifv|webm))?(\?.*)?$/i;
      const IMGUR_ALBUM_RE =
        /^https?:\/\/(?:www\.)?(?:i\.|m\.)?imgur\.com\/(?:a|gallery)\/([\w]+)(\..+)?(?:\/)?(?:#?\w*)?(?:\?_[\w]+=[\w]+)?$/i;
      const YOUTUBE_RE = /^https?:\/\/(?:www\.|m\.)?youtube\.com\/watch\?.*v=([\w-]+)/i;
      const YOUTUBE_ALT_RE = /^https?:\/\/(?:www\.)?youtu\.be\/([\w-]+)/i;
      const TWITTER_RE = /^https?:\/\/(?:mobile\.)?twitter\.com\/(?:#!\/)?[\w]+\/status(?:es)?\/([\d]+)/i;
      const GFYCAT_RE = /^https?:\/\/(?:[\w]+.)?gfycat\.com\/(\w+)(?:\.gif)?/i;
      const GIPHY_RE = /^http:\/\/(?:www\.)?giphy\.com\/gifs\/(.*?)(\/html5)?$/i;
      const GIHPY_ALT_RE = /^http:\/\/(?:www\.)?(?:i\.)?giphy\.com\/([\w]+)(?:.gif)?/i;
      const GIPHY_ALT_2_RE =
        /^https?:\/\/(?:www\.)?(?:media[0-9]?\.)?(?:i\.)?giphy\.com\/(?:media\/)?([\w]+)(?:.gif)?/i;
      const REDDIT_UPLOAD_RE = /^https?:\/\/(?:i\.){1}(?:redditmedia|reddituploads){1}(?:.com){1}/i;
      const REDDIT_VIDEO_RE = /^https?:\/\/(?:v\.){1}(?:redd){1}(?:.it\/){1}(\w+)/i;
      const STREAMABLE_RE = /^https?:\/\/(streamable){1}(?:.com){1}\/([\w-]+){1}/i;
      var mediaType = null;
      console.log('[rpMediaTypeFilter filter] url: ' + url);

      if (IMGUR_RE.test(url)) {
        mediaType = 'imgur';
      } else if (IMGUR_ALBUM_RE.test(url)) {
        mediaType = 'imgurAlbum';
      } else if (YOUTUBE_RE.test(url) || YOUTUBE_ALT_RE.test(url)) {
        mediaType = 'youtube';
      } else if (TWITTER_RE.test(url)) {
        mediaType = 'twitter';
      } else if (GFYCAT_RE.test(url)) {
        mediaType = 'gfycat';
      } else if (GIPHY_RE.test(url) || GIHPY_ALT_RE.test(url) || GIPHY_ALT_2_RE.test(url)) {
        mediaType = 'giphy';
      } else if (REDDIT_UPLOAD_RE.test(url)) {
        mediaType = 'redditUpload';
      } else if (REDDIT_VIDEO_RE.test(url)) {
        mediaType = 'redditVideo';
      } else if (STREAMABLE_RE.test(url)) {
        mediaType = 'streamable';
      } else {
        mediaType = null;
      }

      console.log('[rpMediaTypeFilter filter] mediaType: ' + mediaType);

      return mediaType;
    };
  }

  angular.module('rpMedia')
    .filter('rpMediaTypeFilter', [rpMediaTypeFilter]);
}());
