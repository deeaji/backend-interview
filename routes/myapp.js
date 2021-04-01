const express = require("express");
const router = express.Router();
const Post = require("../models/Posts");
const MyUser = require("../models/User");

const MongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectID;

const verify = require("../verifyToken");

// routes with token
router.get("/", verify, (req, res) => {
  res.send("Welcome to VARE");
});

router.get("/request", (req, res) => {
  res.send(req);
});

router.post("/single", (req, res) => {
  const requestBody = req.body;
  const request = requestBody.data;
  const myDoc = requestBody.doc;
  const myCol = "todo_db";
  const myKey = requestBody.key;

  const data = request;

  const client = new MongoClient(
    process.env.DB_CONNECTION,
    {useNewUrlParser: true},
    {useUnifiedTopology: true}
  );

  client.connect(err => {
    const collection = client.db(myCol).collection(myDoc);

    const searchArray =
      myKey &&
      myKey.length > 0 &&
      myKey.map(info => {
        return request && request[0] && request[0][info]
          ? {[info]: request[0][info]}
          : [];
      });
    // console.log('searchArray',searchArray)
    if (myKey) {
      collection
        .find({
          $and: searchArray
        })
        .toArray(function(err, result) {
          if (result && result.length > 0) return res.status(400).send(result);
          collection
            .insertOne(data)
            .then(result => {
              collection
                .find({
                  [myKey]: request[myKey]
                })
                .toArray(function(err, result) {
                  // res.send(result)
                  res.json({
                    data: result
                  });
                  client.close();
                });
            })
            .catch(err => {
              res.json({
                message: err
              });
            });
        });
    }
    client.close();
  });
});

//update document
// http://localhost:5000/todo_db/update/
//post
// {
//     "key":["item_id","user_id"],
//     "doc":"vare_vote",
//     "data": [
//         {
//             "user_id": "Shavae2006@yahoo.com",
//             "item_id": "hr6760-116",
//             "keyName": "hhhhhh"
//         }
//     ]
// }
router.post("/update", (req, res) => {
  const requestBody = req.body;
  const request = requestBody.data;
  const myDoc = requestBody.doc;
  const myCol = "todo_db";
  const myKey = requestBody.key;

  const client = new MongoClient(
    process.env.DB_CONNECTION,
    {useNewUrlParser: true},
    {useUnifiedTopology: true}
  );

  client.connect(err => {
    const collection = client.db(myCol).collection(myDoc);

    const searchArray =
      myKey &&
      myKey.length > 0 &&
      myKey.map(info => {
        return {[info]: request[0][info]};
      });

    collection.updateMany(
      {$and: searchArray},
      {$set: {...request[0]}},
      {upsert: true},
      function(err, result) {
        collection
          .find({
            $and: searchArray
          })
          .toArray(function(err, result) {
            // res.send(result)
            res.json({
              data: result
            });
            client.close();
          });
      }
    );
  });
});

//search with query document
//endppoint: http://localhost:5000/todo_db/find/
//type: post
// {
//     "doc":"vare_vote",
//     "data": [
//         {"user_id":"Shavae2006@yahoo.com","item_id":"hr6760-116"}
//     ]
// }
router.post("/search", (req, res) => {
  const requestBody = req.body;
  const request = requestBody.data;
  const myDoc = requestBody.doc;
  const myCol = "todo_db";
  const myKey = requestBody.key;

  const client = new MongoClient(
    process.env.DB_CONNECTION,
    {useNewUrlParser: true},
    {useUnifiedTopology: true}
  );

  client.connect(err => {
    const collection = client.db(myCol).collection(myDoc);
    const searchArray =
      request &&
      request[0] &&
      Object.keys(request[0]).map(info => {
        return {[info]: request[0][info]};
      });
    // console.log('searchArray',searchArray)
    collection
      .find({
        $and: searchArray
      })
      .toArray(function(err, result) {
        // res.send(result)
        delete result["installId"];
        res.json({
          data: result
        });
        client.close();
      });
  });
});

//find all document
//endppoint: http://localhost:5000/todo_db/find/
//type: post
// {
//     "doc":"vare_vote",
//     "data": [
//         {"user_id":"Shavae2006@yahoo.com","item_id":"hr6760-116"}
//     ]
// }
router.get("/findall", (req, res) => {
  const requestBody = req.query;
  const request = requestBody.data;
  const myDoc = requestBody.doc;
  const myCol = "todo_db";
  const myKey = requestBody.key;

  const client = new MongoClient(
    process.env.DB_CONNECTION,
    {useNewUrlParser: true},
    {useUnifiedTopology: true}
  );

  client.connect(err => {
    const collection = client.db(myCol).collection(myDoc);
    // console.log('searchArray',searchArray)
    collection
      .find({})
      .limit(500)
      .toArray(function(err, result) {
        // res.send(result)
        res.json({
          data: result
        });
        client.close();
      });
  });
});

// search by id
//http://localhost:5000/todo_db/search?id=5fb586050dff1af444e716db&doc=vare_vote
router.get("/find", (req, res) => {
  const requestBody = req.query;
  const id = requestBody.id;
  const myDoc = requestBody.doc;
  const myCol = "todo_db";

  const client = new MongoClient(
    process.env.DB_CONNECTION,
    {useNewUrlParser: true},
    {useUnifiedTopology: true}
  );

  client.connect(err => {
    const collection = client.db(myCol).collection(myDoc);
    // console.log('searchArray',searchArray)
    collection
      .find(
        //  {},  //get all data
        {_id: ObjectId(id)}
      )
      .toArray(function(err, result) {
        res.json({
          data: result
        });
        client.close();
      });
  });
});

//group votes and count response
//endppoint: http://localhost:5000/todo_db/votes
//type: post
// {
//     "doc":"vare_vote",
//     "data": ["hr6760-116","ccxxxhhhhhh","P60012143_voteMeIn"]
// }
router.post("/votes", (req, res) => {
  const requestBody = req.body;
  const request = requestBody.data;
  const myDoc = requestBody.doc;
  const myCol = "todo_db";
  // const myKey = requestBody.key;

  const client = new MongoClient(
    process.env.DB_CONNECTION,
    {useNewUrlParser: true},
    {useUnifiedTopology: true}
  );

  client.connect(err => {
    const collection = client.db(myCol).collection(myDoc);
    collection
      .aggregate([
        {
          $group: {
            _id: "$item_id",
            [myDoc]: {$push: "$vote"},
            count: {$sum: 1}
          }
        }
      ])
      .toArray(function(err, result) {
        const finteredArray =
          result &&
          result.length > 0 &&
          result.filter(info => {
            return request && request.length > 0 && request.includes(info._id);
          });

        const finalResult =
          finteredArray && finteredArray.length > 0
            ? finteredArray.map(info => {
                const tempObject = {};
                tempObject["_id"] = info._id;
                tempObject["votes"] = info.vare_vote.reduce(
                  (a, c) => ((a[c] = (a[c] || 0) + 1), a),
                  Object.create(null)
                );
                tempObject["count"] = info.count;
                return tempObject;
              })
            : [];

        res.json({
          data: finalResult
        });
        // res.send(finalResult)
        client.close();
      });
  });
});

//create multiple document
//endppoint: http://localhost:5000/todo_db/single/
//type: post
// {
//     "key":["user_id","item_id"],  //where user_id and item_id values does not exist
//     "doc":"vare_vote",
//     "data": [
//         {
//             "user_id": "Shavae2006@yahoo.com",
//             "item_id": "hr6760-116",
//             "vote": "yes",
//             "Timestamp": "0000-00-00 00:00:00",
//             "installId": "ww7FB4E2EF-4722-48F2-9324-1B51468F39B0",
//             "keyName": ""
//         }
//     ]
// }
router.post("/many", verify, async (req, res) => {
  const requestBody = req.body;
  const request = requestBody.data;
  const myDoc = requestBody.doc;
  const myCol = "todo_db";
  const myKey = requestBody.key;

  const data = request;
  // await request && request.map(request => {
  //   if(myDoc == 'vare_user') return new MyUser({...request})
  //   if(myDoc == 'vare_vote') return new VareVote({...request})
  //   else return request
  // })
  // console.log('data',data)
  const client = new MongoClient(
    process.env.DB_CONNECTION,
    {useNewUrlParser: true},
    {useUnifiedTopology: true}
  );

  client.connect(err => {
    const collection = client.db(myCol).collection(myDoc);

    // if(myKey){
    //       collection.find({}).toArray(function(err, result){

    //check if data exist, if so stop insert
    // if(result && result.length > 0) return res.status(400).send(result)

    collection
      .insertMany(data, {
        ordered: true
      })
      .then(result => {
        // console.log('result',result);
        // res.json(result)
        res.json({
          data: result
        });
        client.close();
      })
      .catch(err => {
        res.json({
          message: err
        });
      });

    // })
    // } else {
    //   collection.insertMany(data,{
    //     ordered:true
    //   })
    //   .then(result => {
    //      // console.log('result',result);
    //      // res.json(result)
    //      res.json({
    //        data: result
    //      })
    //      client.close();
    //   })
    //   .catch(err => {
    //      res.json({
    //        message: err
    //      })
    //   })
    // }
  });
});

//delete document
// http://localhost:5000/todo_db/delete/
//post
// {
//     "key":["item_id","user_id"],
//     "doc":"vare_vote",
//     "data": [
//         {
//             "user_id": "Shavae2006@yahoo.com",
//             "item_id": "hr6760-116",
//             "keyName": "hhhhhh"
//         }
//     ]
// }
router.delete("/delete", (req, res) => {
  const requestBody = req.query;
  const myDoc = requestBody.doc;
  const myCol = "todo_db";
  const id = requestBody.id;

  // console.log('id',req)
  const client = new MongoClient(
    process.env.DB_CONNECTION,
    {useNewUrlParser: true},
    {useUnifiedTopology: true}
  );

  client.connect(err => {
    const collection = client.db(myCol).collection(myDoc);

    // collection.deleteMany(
    collection.findOneAndDelete({_id: ObjectId(id)}, function(err, result) {
      // res.send(result)
      res.json({
        data: result
      });
      client.close();
    });
  });
});

// search by id
//http://localhost:5000/todo_db/search?id=5fb586050dff1af444e716db&doc=vare_vote
// router.post('/upload', (req, res) => {
//   console.log(req.files.foo); // the uploaded file object
// });

module.exports = router;
