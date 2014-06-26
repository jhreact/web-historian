var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
// Yeah, yeah, yeah...this is synchronous
var index = fs.readFileSync('./web/public/index.html', 'utf8');
// var index = fs.readFile('./web/public/index.html', 'utf8', function() {});
// var index = getFile('./web/public/index.html');
var loading = fs.readFileSync('./web/public/loading.html', 'utf8');
var styles = fs.readFileSync('./web/public/styles.css', 'utf8');

var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
};

// var getFile = function(file) {
//   fs.readFile(file, 'utf8', function(err, data) {
//     if (err) {
//       throw err;
//     }
//     return data;
//   });
// };


var sendResponse = function(res, data, statusCode, ctype) {
  statusCode = statusCode || 200;
  headers['Content-Type'] = ctype || "text/html";
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

var loadUrl = function(req, res) {
  // process postdata
  // debugger;
  collectData(req, function(err, data) {
    var submittedUrl = data.split('=')[1];
    if (archive.isUrlInList(submittedUrl)) {
      sendResponse(res, fs.readFileSync(
        path.join(archive.paths['archivedSites'], submittedUrl)
      ));
    } else {
      sendLoading(req, res);
    }
  });
  // if url in listofurls
  //    load sitedata from filesystem
  //    respond with sitedata
  // else
  //   add to sites.text
  //   respond with loading page
};

var sendStyles = function(req, res) {
  sendResponse(res, styles, 200, 'text/css');
};

// var postHelper = function(req, res) {
//   collectData(req, function(err, data) {
//     sendResponse(res, data, 201);
//   });
// };

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
