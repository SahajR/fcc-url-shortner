var express = require('express');
var dbstore = require('./dbstore');
var app = express(), port = process.env.PORT || 8080;

app.get("/new/:url*", function(req, res){
  var url = req.url.slice(5), finalObj = {};
  if(!validateURL(url)) {
    res.setHeader('Content-Type', 'application/json');
    res.send({"error":"Invalid URL provided!"});
    return;
  }
  var urlId = "";
  dbstore.gen(url, function(err, shortUrl) {
    if (err) urlId = err;
    else
    urlId = shortUrl.toString();
    dbstore.getRedirectUrl(urlId, function(err, redirectUrl){
      if(err) { 
        res.setHeader('Content-Type', 'application/json');
        res.send({"error":err});
      } else {
        finalObj.originalURL = redirectUrl;
        finalObj.shortURL = "https://fcc-urlshort-sahaj.herokuapp.com/" + shortUrl;
        res.setHeader('Content-Type', 'application/json');
        res.send(finalObj);
      }
    });
  });
});

app.get("/:url", function(req, res) {
  var finalObj = {};
  var urlId = req.params.url;
  dbstore.getRedirectUrl(urlId, function(err, redirectUrl){
      if(err) { 
        res.setHeader('Content-Type', 'application/json');
        res.send({"error":err});
      } else {
        finalObj.originalURL = redirectUrl;
        finalObj.shortURL = "https://fcc-urlshort-sahaj.herokuapp.com/" + urlId;
        res.setHeader('Content-Type', 'application/json');
        res.send(finalObj);
      }
    });
});

app.get("/", function(req, res) {
  res.send("<h1>URL shortner for fcc challenge.</h1><h4>refer <a href=\"https://little-url.herokuapp.com/\"> here </a>for instructions.</h6>");
});

app.get("/new", function(req, res) {
  res.send("Please provide a URL to be shortened...");
});

app.listen(port, function () {
  console.log('App listening on port ' + port + '!');
});

 function validateURL(url) {
    // Checks to see if it is an actual url
    // Regex from https://gist.github.com/dperini/729294
    var regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
    return regex.test(url);
  }