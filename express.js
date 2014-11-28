#!/usr/bin/env node

var express = require('express')
var app = express()
var oauthshim = require('oauth-shim')
// Print request->response to console.
oauthshim.debug = true;

app.use(express.static('./'));

app.all('/oauthproxy', oauthshim.request);

// Initiate the shim with Client ID's e.g.
oauthshim.init({
    // key : Secret
    'eguczzSgqwHRwGUkKv0pfChlt' : 'j2O6XsQbuF4uZE8TjcFhzEY85Q3gIhNYbe2witwG3oeuO6lr8W'
});

var server = app.listen(9000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})
