//var db = require("../../models"); this does not recognize require ? why ?

// // Get references to page elements
// var $exampleText = $("#example-text");
// var $exampleDescription = $("#example-description");
// var $submitBtn = $("#submit");
// var $exampleList = $("#example-list");

// The API object contains methods for each kind of request we'll make
var API = {

  // saveExample: function(example) {
  //   return $.ajax({
  //     headers: {
  //       "Content-Type": "application/json"
  //     },
  //     type: "POST",
  //     url: "api/examples",
  //     data: JSON.stringify(example)
  //   });
  // },
  // getExamples: function() {
  //   return $.ajax({
  //     url: "api/examples",
  //     type: "GET"
  //   });
  // },
  // deleteExample: function(id) {
  //   return $.ajax({
  //     url: "api/examples/" + id,
  //     type: "DELETE"
  //   });
  // },

  postFace: function (link,first_name, user_name) {
    console.log('postface. This is data to be posted:');
    console.log(link, first_name, user_name);
    //insert username and userlastname into database
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/face/upload",
      data: JSON.stringify({ 
                            link: link,
                            first_name: first_name,
                            user_name: user_name
                           })
    }).then(function(data){
      var data = JSON.parse(data);
      console.log('This is THEN condition of postFace. The Microsoft faceId is: ')
      console.log(data[0].faceId);
      //insert faceID into database:
    });
  },

  postFaceFile: function (link) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/face/uploadfile",
      data: JSON.stringify({ link: link })
    });
  },

  postFaceCompare: function (link) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/face/compare",
      data: JSON.stringify({ link: link })
    });
  },

  login: function() {
    console.log('login pressed');
       return $.ajax({
         url: "/login",
         type: "GET"
       });
  },

  submitLogin: function(username, link_to_fresh_foto) {
    console.log('this is submitLogin()');
    console.log(username,link_to_fresh_foto);
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/face/compare",
      data: JSON.stringify({ username: username, link_to_fresh_foto: link_to_fresh_foto  })
    });
       
  }


};

// // refreshExamples gets new examples from the db and repopulates the list
// var refreshExamples = function() {
//   API.getExamples().then(function(data) {
//     var $examples = data.map(function(example) {
//       var $a = $("<a>")
//         .text(example.text)
//         .attr("href", "/example/" + example.id);

//       var $li = $("<li>")
//         .attr({
//           class: "list-group-item",
//           "data-id": example.id
//         })
//         .append($a);

//       var $button = $("<button>")
//         .addClass("btn btn-danger float-right delete")
//         .text("ｘ");

//       $li.append($button);

//       return $li;
//     });

//     $exampleList.empty();
//     $exampleList.append($examples);
//   });
// };

// // handleFormSubmit is called whenever we submit a new example
// // Save the new example to the db and refresh the list
// var handleFormSubmit = function(event) {
//   event.preventDefault();

//   var example = {
//     text: $exampleText.val().trim(),
//     description: $exampleDescription.val().trim()
//   };

//   if (!(example.text && example.description)) {
//     alert("You must enter an example text and description!");
//     return;
//   }

//   API.saveExample(example).then(function() {
//     refreshExamples();
//   });

//   $exampleText.val("");
//   $exampleDescription.val("");
// };

// // handleDeleteBtnClick is called when an example's delete button is clicked
// // Remove the example from the db and refresh the list
// var handleDeleteBtnClick = function() {
//   var idToDelete = $(this)
//     .parent()
//     .attr("data-id");

//   API.deleteExample(idToDelete).then(function() {
//     refreshExamples();
//   });
// };

// // Add event listeners to the submit and delete buttons
// $submitBtn.on("click", handleFormSubmit);
// $exampleList.on("click", ".delete", handleDeleteBtnClick);

//This button makes a post to api/face/upload using API.postFace()
$("#uploadFace").on("click", function (event) {

  event.preventDefault();
  $linkToPicture = $("#link-to-picture").val().trim();
  $first_name = $("#first_name").val().trim();; // need to get gtom text box
  $user_name = $("#user_name").val().trim();; // ned to get from text box
  console.log($linkToPicture);
  console.log('Calling API.getFace()');
  API.postFace($linkToPicture, $first_name, $user_name);
})

//This button makes a post to api/face/uploadfile
$("#uploadFaceFile").on("click", function (event) {

  event.preventDefault();
  $linkToPicture = $("#link-to-picture").val().trim();
  console.log($linkToPicture);
  console.log('Calling API.getFaceFile()');
  API.postFaceFile($linkToPicture);
})

//This temporary button makes a post to api/face/compare
$("#faceCompare").on("click", function (event) {

  event.preventDefault();
  $linkToPicture = $("#link-to-picture").val().trim();
  console.log($linkToPicture);
  console.log('Calling API.getFaceFile()');
  API.postFaceCompare($linkToPicture);
})

//This temporary button makes a post to api/face/compare
$("#goto-login-page").on("click", function (event) {

 API.login()
})

//This temporary button makes a post to api/face/compare
$("#submit-login").on("click", function (event) {
  console.log('submit-login was pressed')
  $username = $("#userName").val().trim();
  $link_to_fresh_foto = $("#login-link-to-fresh-picture").val().trim();
  API.submitLogin($username, $link_to_fresh_foto);
})