var url = require('url');
var path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require('./http-helpers');
// require more modules/folders here!

var routes = {
  '/' : helpers.sendIndex,
  '/load' : helpers.loadUrl,
  '/styles.css' : helpers.sendStyles
};

exports.handleRequest = function (req, res) {
  var urlPath = url.parse(req.url).pathname;
  var method = req.method;

  if (method ==='OPTIONS') {
    helpers.sendOptionsResponse(req, res);
  } else if (urlPath && routes[urlPath]) {
    routes[urlPath](req, res);
  } else if (archive.isUrlInList(urlPath)) {
    var assetFile = path.join(archive.paths['archivedSites'], urlPath);
    helpers.serveAssets(res, assetFile);
  } else {
    helpers.send404(req, res);
  }
  // res.end(archive.paths.list);
};
