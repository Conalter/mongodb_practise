const express = require('express');
const parser = require('body-parser');
const server = express();

server.use(parser.json());
server.use(parser.urlencoded({extended: true}));

const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;

MongoClient.connect("mongodb://localhost:27017", function(err, client){
  if (err) {
    console.log(err);
    return;
  }
  const db = client.db("Bears");
  console.log("connected to database");

  server.post("/api/bear", function(req, res, next){
    const bearCollection = db.collection("bears");
    const bearToSave = req.body;
    bearCollection.save(bearToSave, function(err, result){
      if (err) next (err);
      res.status(200);
      res.json(result.ops[0]);
      console.log("Woo Hoo! - saved to database!!");
    });
  });

  server.get("/api/bear", function(req, res, next){
    const bearCollection = db.collection("bears");
    // console.log("bear");
    bearCollection.find().toArray(function(err, allBears){
      if (err) next(err);
      res.json(allBears);
    });
  });

  server.delete("/api/bear", function(req, res, next){
    const bearCollection = db.collection("bears");
    bearCollection.remove({}, function(err, result){
      if (err) next(err);
      res.status(200).send();
    });
  });

  server.post("/api/bear", function(req, res, next){
    const bearCollection = db.collection("bears");
    const objectID = ObjectID(req.params.id);
    bearCollection.update({_id: objectID}, req.body,
    function(err, result){
      if (err) next(err);
      res.status(200).send();
    });
  });

  server.listen(3000, function(){
    console.log("Listening on port 3000");
  });
});
