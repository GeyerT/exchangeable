var WebSocketClient = require('websocket').client;
var client = new WebSocketClient();

var connectionBrain = undefined

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

    let type = "client-to-brain-open-connection"
    let message = {
      name: "blockchain"
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
                  console.log("blockchain connected: ", clientMessage.content.success)
                  break;
          }
      }
    });
});

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
