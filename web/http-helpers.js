var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var index = fs.readFileSync('./web/public/index.html', 'utf8');
var loading = fs.readFileSync('./web/public/loading.html', 'utf8');
var styles = fs.readFileSync('./web/public/styles.css', 'utf8');

var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

var sendResponse = function(res, data, statusCode) {
  statusCode = statusCode || 200;
  res.writeHead(statusCode, headers);
  // console.log("DATA: ");
  // console.log(JSON.stringify(data));
  res.end(data);
};

var collectData = function(req, callback) {
  var data = '';
  req.addListener('data', function(chunk) {
    data += chunk;
  });
  req.addListener('end', function() {
    callback(null, JSON.parse(data));
  });
};

var send404 = function(req, res) {
  sendResponse(res, 'Not Found', 404);
};

var sendOptionsResponse = function(req, res) {
  sendResponse(res, null);
};

var serveAssets = function(res, asset) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...), css, or anything that doesn't change often.)
};

var sendIndex = function(req, res) {
  sendResponse(res, index);
};

var sendLoading = function(req, res) {
  sendResponse(res, loading);
};

var sendStyles = function(req, res) {
  sendResponse(res, styles);
};

var postHelper = function(req, res) {
  collectData(req, function(err, data) {
    sendResponse(res, data, 201);
  });
};

// As you progress, keep thinking about what helper functions you can put here!
exports.headers = headers;
exports.sendResponse = sendResponse;
exports.collectData = collectData;
exports.send404 = send404;
exports.sendOptionsResponse = sendOptionsResponse;
exports.serveAssets = serveAssets;
exports.sendIndex = sendIndex;
exports.sendLoading = sendLoading;
exports.sendStyles = sendStyles;
