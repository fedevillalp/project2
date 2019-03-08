var db = require("../models");
var fs = require('fs');
var filename = ("man.jpg");

//'use strict';

const request = require('request');

// Replace <Subscription Key> with your valid subscription key.
const subscriptionKey = process.env.API_KEY;

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

//USING LINK
const options = {
    uri: uriBase,
    qs: params,
    body: '{"url": ' + '"' + imageUrl + '"}',
    headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key' : subscriptionKey
    }
};

//USING FILE
var options_file = {
  uri: uriBase,
  qs: params,
  body: fs.readFileSync(filename),//'  {"url": ' + '"' + imageUrl + '  "}  ',
  headers: {
      'Content-Type': 'application/octet-stream',
      'Ocp-Apim-Subscription-Key' : subscriptionKey
  }
};

module.exports = function(app) {
  // Get all examples
  app.get("/api/users", function(req, res) {
    db.users.findAll({}).then(function(dbUsers) {
      console.log(dbUsers);
      res.json(dbUsers);
      
    });
  });

  // Create a new example
  app.post("/api/signup", function(req, res) {
    db.users.create({
      firstName: 'Dre', 
      lastName: 'Campbell', 
      userPicture: 'https://media.gettyimages.com/photos/universitys-andre-campbell-is-part-of-the-2015-irvine-world-news-picture-id1032185688',
      username: 'drecamp8',
      password: 'password'
    }).then(function(dbUsers) {
      console.log('User created...');
      res.json(dbUsers);
    });
  });

  // // Delete an example by id
  // app.delete("/api/examples/:id", function(req, res) {
  //   db.Example.destroy({ where: { id: req.params.id } }).then(function(dbExample) {
  //     res.json(dbExample);
  //   });
  // });

  //When the client gets this route , a POST is made to the FACE API using 
  //the request library. 

  //USING A LINK TO UPLOAD IMAGE
  app.post("/api/face/upload", function(req, res) {
   
    console.log('This is app.post for /api/face/upload');
    
    imageUrl = JSON.stringify(req.body.link);
    options.body = '{"url": ' +     imageUrl +   '}'

    
    // This code provided by Microsoft to make request
    request.post(options, (error, response, body) => {
      if (error) {
        console.log('Error: ', error);
        return;
      }
      let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
      console.log('JSON Response\n');
      console.log(jsonResponse);

      var faceId = JSON.parse(body);
      faceId = faceId[0].faceId;

      db.users.create({
        firstName: req.body.first_name, 
        userName: req.body.user_name, 
        pictureLink: imageUrl,
        faceId: faceId, 
        password: 'password2'
      }).then(function(dbUsers) {
        console.log('User Test created...');
        //res.json(dbUsers);
      });

      res.json(jsonResponse);
    });
    
  });

  //USING AN ACTUAL FILE TO UPLOAD IMAGE
  app.post("/api/face/uploadfile", function(req, res) {
   
    console.log('This is app.post for /api/face/uploadfile');
    
    //imageUrl = JSON.stringify(req.body.link);
    //options_pic.body = fs.readFileSync(filename)
    
    // This code provided my Microsoft to make request
    request.post(options_file, (error, response, body) => {
      if (error) {
        console.log('Error: ', error);
        return;
      }
      let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
      console.log(jsonResponse);
      res.json(jsonResponse);
    });
    
  });

  //COMPARE TWO FACES USING THEIR MICROSOFT ID's
  app.post("/api/face/compare", function(req, res) {
   
    console.log('This is app.post for /api/face/compare');

    console.log(req.body.username);
    console.log(req.body.link_to_fresh_foto);

    var imageUrl = req.body.link_to_fresh_foto;
    var faceId2;
    var faceId1;

    var options_compare = {
      uri: uriBase,
      qs: params,
      body: '{"url": ' + '"' + imageUrl + '"}',
      headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key' : subscriptionKey
      }
    };

    //options.body = '{"url": ' +     imageUrl +   '}'

    //upload link to microsoft and extract faceID and asign to faceId1
    request.post(options_compare, (error, response, body) => {
      if (error) {
        console.log('Error: ', error);
        return;
      }
      let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
      //console.log('fresh link response this becomes faceId1\n');
      //console.log(jsonResponse);

      var faceId = JSON.parse(body);
      faceId1 = faceId[0].faceId;  // undefined
      console.log('FaceID from fresh link is: ' + faceId1);

  
      //Search for faceID from registration
    db.users.findOne({ where: { userName: req.body.username } }).then(function(data) {
      //console.log(data);
      console.log('Face ID that was found from the database:')
      faceId2 = data.faceId;
      console.log(faceId2);
      compareFaces(faceId1,faceId2);
    });
      
    })


    
    function compareFaces(faceId1,faceId2){
    
        var two_faces_v2 = {
          "faceId1": faceId1, // req.body.link_to_fresh_foto, //"5b5481f0-b8be-4ba7-9e88-6835ff7d5d48",
          "faceId2": faceId2 //from registration //"5b5481f0-b8be-4ba7-9e88-6835ff7d5d48"
        }

        console.log(two_faces_v2);

        const compare = {
          uri: 'https://westus.api.cognitive.microsoft.com/face/v1.0/verify',
          //qs: params,
          body: JSON.stringify(two_faces_v2),
          headers: {
              'Content-Type': 'application/json',
              'Ocp-Apim-Subscription-Key' : subscriptionKey
          }
        };
        
        request.post(compare, (error, response, body) => {
          if (error) {
            console.log('Error: ', error);
            return;
          }
          
          console.log('Compare Faces Response\n');
          console.log(body);
          res.json(body);
          
        });

    }
    
  });
  


};
