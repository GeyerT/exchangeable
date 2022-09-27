const { EventEmitter } = require("events");
const express = require("express");
const cors = require("cors");
const requests = new Object()
var reqId = 0

class APIClient extends EventEmitter {
  constructor(connection) {
    super();
    this.app = express();
    var corsOptions = {
      origin: "http://localhost:9081"
    };
    this.app.use(cors(corsOptions));
    // parse requests of content-type - application/json
    this.app.use(express.json());
    // parse requests of content-type - application/x-www-form-urlencoded
    this.app.use(express.urlencoded({ extended: true }));
    // simple route
    this.app.get("/", (req, res) => {
      res.json({ message: "Welcome." });
    });

    this.connection = connection

    require("./app/routes/tutorial.routes.js")(this.app);
    // set port, listen for requests
    const PORT = process.env.PORT || 9090;
    this.app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  }

  startListeners(connection) {
    this.app.on("createTutorial", function(req, res) {
      requests[reqId] = {
        req: req,
        res: res
      }

      let headers = req.headers
      let uri = req.url
      let method = req.method
      let body = req.body
      let params = req.params.id

      let type = "api-to-brain-request"
      let content = {
        query: "createTutorial",
        reqId: reqId,
        req: {
          headers: headers,
          uri: uri,
          method: method,
          body: body,
          params: params
        }
      }

      sendMessage(connection, type, content)

      reqId++
    })

    this.app.on("getTutorials", function(req, res) {
      requests[reqId] = {
        req: req,
        res: res
      }

      let headers = req.headers
      let uri = req.url
      let method = req.method
      let body = req.body
      let params = req.params.id

      let type = "api-to-brain-request"
      let content = {
        query: "getTutorials",
        reqId: reqId,
        req: {
          headers: headers,
          uri: uri,
          method: method,
          body: body,
          params: params
        }
      }

      sendMessage(connection, type, content)

      reqId++
    })

    this.app.on("publishedTutorials", function(req, res) {
      requests[reqId] = {
        req: req,
        res: res
      }

      let headers = req.headers
      let uri = req.url
      let method = req.method
      let body = req.body
      let params = req.params.id

      let type = "api-to-brain-request"
      let content = {
        query: "publishedTutorials",
        reqId: reqId,
        req: {
          headers: headers,
          uri: uri,
          method: method,
          body: body,
          params: params
        }
      }

      sendMessage(connection, type, content)

      reqId++
    })

    this.app.on("singleTutorial", function(req, res) {
      requests[reqId] = {
        req: req,
        res: res
      }

      let headers = req.headers
      let uri = req.url
      let method = req.method
      let body = req.body
      let params = req.params.id

      let type = "api-to-brain-request"
      let content = {
        query: "singleTutorial",
        reqId: reqId,
        req: {
          headers: headers,
          uri: uri,
          method: method,
          body: body,
          params: params
        }
      }

      sendMessage(connection, type, content)

      reqId++
    })

    this.app.on("updateTutorial", function(req, res) {
      requests[reqId] = {
        req: req,
        res: res
      }

      let headers = req.headers
      let uri = req.url
      let method = req.method
      let body = req.body
      let params = req.params.id

      let type = "api-to-brain-request"
      let content = {
        query: "updateTutorial",
        reqId: reqId,
        req: {
          headers: headers,
          uri: uri,
          method: method,
          body: body,
          params: params
        }
      }

      sendMessage(connection, type, content)

      reqId++
    })

    this.app.on("deleteTutorial", function(req, res) {
      requests[reqId] = {
        req: req,
        res: res
      }

      let headers = req.headers
      let uri = req.url
      let method = req.method
      let body = req.body
      let params = req.params.id

      let type = "api-to-brain-request"
      let content = {
        query: "deleteTutorial",
        reqId: reqId,
        req: {
          headers: headers,
          uri: uri,
          method: method,
          body: body,
          params: params
        }
      }

      sendMessage(connection, type, content)

      reqId++
    })

    this.app.on("deleteAllTutorials", function(req, res) {
      requests[reqId] = {
        req: req,
        res: res
      }

      let headers = req.headers
      let uri = req.url
      let method = req.method
      let body = req.body
      let params = req.params.id

      let type = "api-to-brain-request"
      let content = {
        query: "deleteAllTutorials",
        reqId: reqId,
        req: {
          headers: headers,
          uri: uri,
          method: method,
          body: body,
          params: params
        }
      }

      sendMessage(connection, type, content)

      reqId++
    })

  }

  answerRequest(status, reqId, answer) {
    if (status !== 0) {
      requests[reqId].res.status(status).send({
        message: "Some error occurred while retrieving tutorials.",
        data: answer
      });
    }
    else {
      requests[reqId].res.send({
        data: answer
      })
    }

    delete requests[reqId]
  }
}

function createMessage(type, message)
{
  object_message = {
    type: type,
    content: message
  }
  return JSON.stringify(object_message);
}

function sendMessage(connection, type, message)
{
  messageString = createMessage(type, message)
  connection.send(messageString);
}

module.exports = APIClient;
