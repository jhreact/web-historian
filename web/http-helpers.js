var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
};


var sendResponse = function(res, data, statusCode, ctype) {
  statusCode = statusCode || 200;
  headers['Content-Type'] = ctype || "text/html";
  res.writeHead(statusCode, headers);
  res.end(data);
};

var collectData = function(req, callback) {
  var data = '';
  req.addListener('data', function(chunk) {
    data += chunk;
  });
  req.addListener('end', function() {
    if (data) {
      callback(null, data);
    }
  });
};

var send404 = function(req, res) {
  sendResponse(res, 'Not Found', 404);
};

var sendOptionsResponse = function(req, res) {
  sendResponse(res, null);
};

var serveAssets = function(res, asset, statusCode, ctype) {
  fs.readFile(asset, 'utf8', function(err, data) {
    if (err) {
      throw err;
    }
    sendResponse(res, data, statusCode, ctype);
  });
};

var sendStyles = function(req, res) {
  var styles = path.join(archive.paths['siteAssets'], 'styles.css');
  serveAssets(res, styles, 200, 'text/css');
};

var sendIndex = function(req, res) {
  var index = path.join(archive.paths['siteAssets'], 'index.html');
  serveAssets(res, index);
};

var sendLoading = function(req, res) {
  var loading = path.join(archive.paths['siteAssets'], 'loading.html');
  serveAssets(res, loading);
};

var loadUrl = function(req, res) {
  collectData(req, function(err, data) {
    var submittedUrl = data.split('=')[1];
    if (archive.isUrlInList(submittedUrl)) {
      var archivedUrl = path.join(archive.paths['archivedSites'], submittedUrl);
      serveAssets(res, archivedUrl, 302);
    } else {
      fs.appendFile(archive.paths['list'], submittedUrl + '\n', function(err) {
        if (err){
          throw err;
        }
        sendLoading(req, res);
      });
    }
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
exports.loadUrl = loadUrl;
exports.sendLoading = sendLoading;
exports.sendStyles = sendStyles;
