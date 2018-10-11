'use strict';

var express = require('express');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');

var authObj = require("./Auth.js").Create({
    tenant:"aadnodejstest.onmicrosoft.com",
    clientId:"edce4438-2a8f-4da4-93dc-41e3646fdf56",
    secret:"Es8bqpLtZalpXhOdK/pERgSz+dM48M7hoEkzV5Udgzo=",
    redirectUri:"https://aad-nodejs-test3.azurewebsites.net/getAToken"
});

var app = express();
app.use(cookieParser('a deep secret'));
app.use(cookieSession({name: 'session',keys: [""]}));

app.get('/', function(req, res) {
    res.end('\
        <head>\
        <title>test</title>\
        </head>\
        <body>\
        <h3>dummy login page</h3>\
        <a href="./auth">Login</a>\
        </body>\
    ');
});

app.get('/auth', function(req, res) {
    authObj.loginIfNotAuth(req,res,function(){
        res.send("authed");
    });
});

app.get('/getAToken', function(req, res) {
    authObj.receiveToken(req,res,function(){
        res.redirect('/AuthInfo');
    });
});

app.get('/AuthInfo', function(req, res) {
    var sessionValue = req.session.authInfo;
    var authString = JSON.stringify(sessionValue);
    var userID = sessionValue.userId;
    var familyName = sessionValue.familyName;
    var givenName = sessionValue.givenName;

    res.end(`\
        <h1>UserID: ${userID}</h1>
        <h2>familyName: ${familyName}</h2>
        <h2>givenName: ${givenName}</h2>
        <h2>full data:</h2>
        <p>${authString}</p>
    `);
});
var port = process.env.port || 3000;
app.listen(port);
console.log("listen 3000");