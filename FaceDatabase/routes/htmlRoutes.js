var db = require("../models");

// module.exports = router;
module.exports = function(app) {
  //Load index page
  app.get("/", function(req, res) {
    console.log('this was /')
    console.log('Your local key is' + process.env.API_KEY)
    res.render("index");
    // db.Example.findAll({}).then(function(dbExamples) {
    //   res.render("index", {
    //     msg: "Welcome!",
    //     examples: dbExamples
    //   });
    // });
  });

  app.get("/login", function (req, res) {
    console.log('this is app.get /login');
    //console.log(req);
    res.render("login");
    console.log('this is app.get /login after called res.render login');
  })



  // // Load example page and pass in an example by id
  // app.get("/example/:id", function(req, res) {
  //   db.Example.findOne({ where: { id: req.params.id } }).then(function(dbExample) {
  //     res.render("example", {
  //       example: dbExample
  //     });
  //   });
  // });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
