var db = require("../models");

//'use strict';

const request = require('request');

// Replace <Subscription Key> with your valid subscription key.
const subscriptionKey = '651740b5ffa343dc82aa1da95c88fde8';

// You must use the same location in your REST call as you used to get your
// subscription keys. For example, if you got your subscription keys from
// westus, replace "westcentralus" in the URL below with "westus".
const uriBase = 'https://westus.api.cognitive.microsoft.com/face/v1.0/detect';

var imageUrl =
      'https://images.pexels.com/photos/1139743/pexels-photo-1139743.jpeg?cs=srgb&dl=adult-confidence-elderly-man-1139743.jpg&fm=jpg';
     
// Request parameters.
const params = {
    'returnFaceId': 'true',
    'returnFaceLandmarks': 'false',
    'returnFaceAttributes': 'age,gender,headPose,smile,facialHair,glasses,' +
        'emotion,hair,makeup,occlusion,accessories,blur,exposure,noise'
};

const options = {
    uri: uriBase,
    qs: params,
    body: '{"url": ' + '"' + imageUrl + '"}',
    headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key' : subscriptionKey
    }
};

module.exports = function(app) {
  // // Get all examples
  // app.get("/api/examples", function(req, res) {
  //   db.Example.findAll({}).then(function(dbExamples) {
  //     res.json(dbExamples);
  //   });
  // });

  // // Create a new example
  // app.post("/api/examples", function(req, res) {
  //   db.Example.create(req.body).then(function(dbExample) {
  //     res.json(dbExample);
  //   });
  // });

  // // Delete an example by id
  // app.delete("/api/examples/:id", function(req, res) {
  //   db.Example.destroy({ where: { id: req.params.id } }).then(function(dbExample) {
  //     res.json(dbExample);
  //   });
  // });

  //When the client gets this route , a POST is made to the FACE API using 
  //the request library.


  app.post("/api/face/upload", function(req, res) {
   
    console.log('this is  app.post for /api/face/upload');
    
    imageUrl = JSON.stringify(req.body.link);
    options.body = '{"url": ' +     imageUrl +   '}'
    
    // This code provided my Microsoft to make request
    request.post(options, (error, response, body) => {
      if (error) {
        console.log('Error: ', error);
        return;
      }
      let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
      console.log('JSON Response\n');
      console.log(jsonResponse);
      res.json(jsonResponse);
      
    });
    

  });
  


};
