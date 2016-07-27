var dbfn = {};
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var dburl = process.env.MONGOLAB_URI;  
var shortid = require('shortid');

dbfn.gen = function(url, callback) {

    MongoClient.connect(dburl, function (err, db) {
    if (err) {
     console.log('Unable to connect to the mongoDB server. Error:', err);
     callback(err);
    } else {
        console.log('Connection established to', dburl);
        var id = shortid.generate();
        db.collection("short-urls").insertOne({
            _id: id,
            urlMap: url
        }, function(err, obj) {
            if(err) {
                callback(err);
                db.close();
                return;
            } else {
                callback(null, obj.insertedId);
                db.close();
                return;
            }
        });
  }
});
}

dbfn.getRedirectUrl = function (id, callback) {

    MongoClient.connect(dburl, function (err, db) {
    if (err) {
     console.log('Unable to connect to the mongoDB server. Error:', err);
     callback(err);
    } else {
        console.log('Connection established to', dburl);
        db.collection("short-urls").findOne({
            _id: id
        }, function(err, redirectUrl){
            if (err) {
                callback(err);
                db.close();
                return;
            } else {
                if(!redirectUrl) {
                    callback("Error! No such short URL exists!");
                    db.close();
                    return;
                }
                callback(null, redirectUrl.urlMap);
                db.close();
                return;
            }
        });
  }
});
}

module.exports = dbfn;