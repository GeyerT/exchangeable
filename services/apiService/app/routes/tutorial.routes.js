module.exports = app => {
  var router = require("express").Router();
  // Create a new Tutorial
  router.post("/", function(req, res) {
    app.emit("createTutorial", req, res)
  })
  //tutorials.create);
  // Retrieve all Tutorials
  router.get("/", function(req, res) {
    app.emit("getTutorials", req, res)
  })
  //tutorials.findAll);
  // Retrieve all published Tutorials
  router.get("/published", function(req, res) {
    app.emit("publishedTutorials", req, res)
  })
  //tutorials.findAllPublished);
  // Retrieve a single Tutorial with id
  router.get("/:id", function(req, res) {
    app.emit("singleTutorial", req, res)
  })
  //tutorials.findOne);
  // Update a Tutorial with id
  router.put("/:id", function(req, res) {
    app.emit("updateTutorial", req, res)
  })
  //tutorials.update);
  // Delete a Tutorial with id
  router.delete("/:id", function(req, res) {
    app.emit("deleteTutorial", req, res)
  })
  //tutorials.delete);
  // Delete all Tutorials
  router.delete("/", function(req, res) {
    app.emit("deleteAllTutorials", req, res)
  })
  //tutorials.deleteAll);
  app.use('/api/tutorials', router);
};
