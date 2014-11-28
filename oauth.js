#!/usr/bin/env node

var oauthshim = require('oauth-shim'),
    express = require('express');

var app = express();
app.all('/oauthproxy', oauthshim.request);

// Initiate the shim with Client ID's e.g.
oauthshim.init({
    // key : Secret
    'eguczzSgqwHRwGUkKv0pfChlt' : 'j2O6XsQbuF4uZE8TjcFhzEY85Q3gIhNYbe2witwG3oeuO6lr8W'
});

// Print request->response to console.
oauthshim.debug = true;