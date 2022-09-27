const http = require("http");
const WebSocketServer = require("websocket").server;

// Create a simple web server that returns the same response for any request
var server = http.createServer(function(request, response) {
    console.log("Received HTTP request for URL", request.url);

    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end("This is a simple node.js HTTP server.");
});

// Listen on port 8080
server.listen(8080, function() {
    console.log("Server has started listening on port 8080");
});

// Attach WebSocket Server to HTTP Server
var wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

var clients = {
  array: new Array()
}

//Handeling first initial connection
wsServer.on("request", function(request) {
    var connection = request.accept();
    console.log("Connection from " + request.remoteAddress + " accepted.");
    var client = {
        connection: connection,
        latencyTrips: []
    };



    // Handle receiving of messages
    connection.on("message", async function(messageIncoming) {
        let type = undefined
        let message = undefined

        if (messageIncoming.type === "utf8") {
            var clientMessage = JSON.parse(messageIncoming.utf8Data);
            // Handle Message based on message type

            switch (clientMessage.type) {
                case "client-to-brain-open-connection":
                    clients[clientMessage.content.name] = client
                    client.name = clientMessage.content.name
                    clients.array.push(client)

                    type = "brain-to-service-connection-opened"
                    message = {
                      success: true
                    }

                    sendMessage(clients[clientMessage.content.name].connection, type, message)
                    break;

                case "api-to-brain-request":
                    type = "brain-to-database-request"
                    message = {
                      query: clientMessage.content.query,
                      reqId: clientMessage.content.reqId,
                      req: clientMessage.content.req
                    }

                    sendMessage(clients.database.connection, type, message)
                    break;

                case "database-to-brain-answer-request":
                    type = "brain-to-api-answer-request"
                    message = clientMessage.content

                    sendMessage(clients.api.connection, type, message)
                    break;

            }
        }
    });

    // Handle closing of connection
    connection.on("close", function(e) {
        console.log("Connection from " + request.remoteAddress + " disconnected.");

        var index = clients.array.indexOf(client);
        delete clients[clients.array[index].name]
        if (index > -1) {
          clients.array.splice(index, 1);
        }

        for (key in clients) {
          console.log(key)
        }
    });
});

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
