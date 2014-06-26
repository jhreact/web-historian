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
  var path = url.parse(req.url).pathname;
  var method = req.method;

  if (method ==='OPTIONS') {
    helpers.sendOptionsResponse(req, res);
  } else if (path && routes[path]) {
    routes[path](req, res);
  } else {
    helpers.send404(req, res);
  }
  // res.end(archive.paths.list);
};
