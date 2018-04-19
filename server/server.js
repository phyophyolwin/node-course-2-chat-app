const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');//to set up the server to communicate server and client two ways

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);// get the web socket server, now ready to connect the connection

app.use(express.static(publicPath));//setting the public folder

io.on('connection', (socket) =>{//this socket is similar to client socket
    console.log('New user conneccted');

    socket.on('disconnect', () =>{
        console.log('User was disconnected');
    });

}); //this is to register the event

server.listen(port, () =>{
    console.log(`Server is up on port ${port}`);
});



