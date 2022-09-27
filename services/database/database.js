var WebSocketClient = require('websocket').client;
var client = new WebSocketClient();
const { EventEmitter } = require("events");
class MyEmitter extends EventEmitter {}
var con = undefined
var emitter = undefined
var connectionBrain = undefined

const tutorials = require("./controllers/tutorial.controller.js");

client.on('connectFailed', async function(error) {
    console.log('Connect Error: ' + error.toString());
    await delay(1000)
    connectBrain()
});

async function connectBrain()
{
  client.connect('ws://exchangeable_server_1:8080/');
}

client.on('connect', async function(connection) {
    console.log('WebSocket Client Connected');
    connectionBrain = connection

    emitter = new MyEmitter()
    startListeners()

    let type = "client-to-brain-open-connection"
    let message = {
      name: "database"
    }

    sendMessage(connectionBrain, type, message)

    connection.on('error', function(error)
    {
      process.on('SIGINT', () => {
        console.log('Got SIGINT signal.');
      });

      setTimeout(() => {
        console.log('Exiting.');
        process.exit(0);
      }, 100);

      process.kill(process.pid, 'SIGINT');
      console.log("Connection Error: " + error.toString());
    });

    connection.on('close', function()
    {
      process.on('SIGINT', () => {
        console.log('Got SIGINT signal.');
      });

      setTimeout(() => {
        console.log('Exiting.');
        process.exit(0);
      }, 100);

      process.kill(process.pid, 'SIGINT');
      console.log('echo-protocol Connection Closed');
    });

    //server message sniffer
    connection.on('message', async function(message)
    {
      if (message.type === "utf8") {
          var clientMessage = JSON.parse(message.utf8Data);
          switch (clientMessage.type) {
              case "brain-to-service-connection-opened":
                  console.log("database connected: ", clientMessage.content.success)
                  break;

              case "brain-to-database-request":
                  processRequest(clientMessage.content.query, clientMessage.content.reqId, clientMessage.content.req)
                  break;
          }
      }
    });
});

function processRequest(query, reqId, req) {
  switch (query) {
    case "createTutorial":
        tutorials.create(req, reqId, emitter)
        break;

    case "getTutorials":
        tutorials.findAll(req, reqId, emitter)
        break;

    case "publishedTutorials":
        tutorials.findAllPublished(req, reqId, emitter)
        break;

    case "singleTutorial":
        tutorials.findOne(req, reqId, emitter)
        break;

    case "updateTutorial":
        tutorials.update(req, reqId, emitter)
        break;

    case "deleteTutorial":
        tutorials.delete(req, reqId, emitter)
        break;

    case "deleteAllTutorials":
        tutorials.deleteAll(req, reqId, emitter)
        break;

    default:
        break;
  }
}

function startListeners() {
  emitter.on("createTutorial", function(status, reqId, message) {
    let type = "database-to-brain-answer-request"
    let content = {
      status: status,
      reqId: reqId,
      data: message
    }
    sendMessage(connectionBrain, type, content)
  })

  emitter.on("getTutorials", function(status, reqId, message) {
    let type = "database-to-brain-answer-request"
    let content = {
      status: status,
      reqId: reqId,
      data: message
    }
    sendMessage(connectionBrain, type, content)
  })

  emitter.on("publishedTutorials", function(status, reqId, message) {
    let type = "database-to-brain-answer-request"
    let content = {
      status: status,
      reqId: reqId,
      data: message
    }
    sendMessage(connectionBrain, type, content)
  })

  emitter.on("singleTutorial", function(status, reqId, message) {
    let type = "database-to-brain-answer-request"
    let content = {
      status: status,
      reqId: reqId,
      data: message
    }
    sendMessage(connectionBrain, type, content)
  })

  emitter.on("updateTutorial", function(status, reqId, message) {
    let type = "database-to-brain-answer-request"
    let content = {
      status: status,
      reqId: reqId,
      data: message
    }
    sendMessage(connectionBrain, type, content)
  })

  emitter.on("deleteTutorial", function(status, reqId, message) {
    let type = "database-to-brain-answer-request"
    let content = {
      status: status,
      reqId: reqId,
      data: message
    }
    sendMessage(connectionBrain, type, content)
  })

  emitter.on("deleteAllTutorials", function(status, reqId, message) {
    let type = "database-to-brain-answer-request"
    let content = {
      status: status,
      reqId: reqId,
      data: message
    }
    sendMessage(connectionBrain, type, content)
  })

}

/* STANDARD FUNCTIONS BELOW */

connectBrain()

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

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
