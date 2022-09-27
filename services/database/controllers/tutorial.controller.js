const Tutorial = require("../models/tutorial.model.js");
// Create and Save a new Tutorial
exports.create = (req, reqId, emitter) => {
  // Validate request
  if (!req.body) {
    let status = 400
    let message = "Content can not be empty!"
    emitter.emit("createTutorial", status, reqId, message)
  }
  // Create a Tutorial
  const tutorial = new Tutorial({
    title: req.body.title,
    description: req.body.description,
    published: req.body.published || false
  });
  // Save Tutorial in the database
  Tutorial.create(tutorial, (err, data) => {
    if (err) {
      let status = 500
      let message = err.message || "Some error occurred while creating the Tutorial."
      emitter.emit("createTutorial", status, reqId, message)
    }
    else {
      let status = 0
      let message = data
      emitter.emit("createTutorial", status, reqId, message)
    }
  });
};

// Retrieve all Tutorials from the database (with condition).
exports.findAll = (req, reqId, emitter) => {
  const title = (req.hasOwnProperty("query")) ? req.query.title : undefined;
  Tutorial.getAll(title, (err, data) => {
    if (err) {
      let status = 500
      let message = err.message || "Some error occurred while retrieving tutorials."
      emitter.emit("getTutorials", status, reqId, message)
    }
    else {
      let status = 0
      let message = data
      emitter.emit("getTutorials", status, reqId, message)
    }
  });
};

exports.findAllPublished = (req, reqId, emitter) => {
  Tutorial.getAllPublished((err, data) => {
    if (err) {
      let status = 500
      let message = err.message || "Some error occurred while retrieving tutorials."
      emitter.emit("publishedTutorials", status, reqId, message)
    }
    else {
      let status = 0
      let message = data
      emitter.emit("publishedTutorials", status, reqId, message)
    }
  });
};

exports.findOne = (req, reqId, emitter) => {
  Tutorial.findById(req.params, (err, data) => {
    if (err) {
      let status = (err.kind === "not_found") ? 404 : 500
      let message = (err.kind === "not_found") ? `Not found Tutorial with id ${req.params}.` : "Error retrieving Tutorial with id " + req.params
      emitter.emit("singleTutorial", status, reqId, message)
    }
    else {
      let status = 0
      let message = data
      emitter.emit("singleTutorial", status, reqId, message)
    }
  });
};

exports.update = (req, reqId, emitter) => {
  // Validate Request
  if (!req.body) {
    let status = 400
    let message = "Content can not be empty!"
    emitter.emit("updateTutorial", status, reqId, message)
  }

  Tutorial.updateById(
    req.params,
    new Tutorial(req.body),
    (err, data) => {
      if (err) {
        let status = (err.kind === "not_found") ? 404 : 500
        let message = (err.kind === "not_found") ? `Not found Tutorial with id ${req.params}.` : "Error updating Tutorial with id " + req.params
        emitter.emit("updateTutorial", status, reqId, message)
      }
      else {
        let status = 0
        let message = data
        emitter.emit("updateTutorial", status, reqId, message)
      }
    }
  );
};

exports.delete = (req, reqId, emitter) => {
  Tutorial.remove(req.params, (err, data) => {
    if (err) {
      let status = (err.kind === "not_found") ? 404 : 500
      let message = (err.kind === "not_found") ? `Not found Tutorial with id ${req.params}.` : "Could not delete Tutorial with id " + req.params
      emitter.emit("deleteTutorial", status, reqId, message)
    }
    else {
      let status = 0
      emitter.emit("deleteTutorial", status, reqId, `Tutorials with id ${req.params} successfully deleted!`)
    }
  });
};

exports.deleteAll = (req, reqId, emitter) => {
  Tutorial.removeAll((err, data) => {
    if (err) {
      let status = 500
      let message = err.message || "Some error occurred while removing all tutorials."
      emitter.emit("deleteAllTutorials", status, reqId, message)
    }
    else {
      let status = 0
      let message = data
      emitter.emit("deleteAllTutorials", status, reqId, `All Tutorials were deleted successfully!`)
    }
  });
};
