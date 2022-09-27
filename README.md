# eXchangeable

Backend based on various Docker Containers. Those containers are connected via a websocket structure and can communicate with each other. The server deals as middleman and sends messages from one container to another.
The available version does allow a user to send requests to an API. The API does recognise those requests and sends them from the API Service to the Database Container. There the requests are getting processed. After either a successful or failed attempt, the database service communicates the results to the API Service, which can now answer the users request.

Download the code, spin up the containers with npm start in the root folder of the project, import the postmanAPICalls.json into Postman and give it a try.
