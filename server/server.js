const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');//to set up the server to communicate server and client two ways

const {generateMessage} = require('./utils/message');
const {generateLocationMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);// get the web socket server, now ready to connect the connection

app.use(express.static(publicPath));//setting the public folder

io.on('connection', (socket) =>{//this socket is similar to client socket
    console.log('New user conneccted');

    socket.emit('newMessage', generateMessage('Admin','Welcome to the chat app'));

    socket.broadcast.emit('newMessage',generateMessage('Admin','New user joined'));

    //this is publisher, first arg is the event name, must be esame as the one in client, second arg is the data to be sent
    // socket.emit('newEmail', {
    //     from: 'mike@example.com',
    //     text: 'Hey. This is server Email.',
    //     createAted: 123
    // });

    // socket.emit('newMessage',{
    //     from: 'mike@example.com',
    //     text: 'Hey. This is server message',
    //     createdAt: 123
    // });

//this is listener from client, 1st arg is the event name, must be sync with client
//2nd arg is the data to be sent to client
    // socket.on('createEmail',(newEmail) =>{
    //     console.log('createEmail', newEmail);
    // });

    socket.on('createMessage',(message, callback) =>{//callback is to ack
        console.log('createMessage', message);
        //io.emit will send message to everyone who is listening to same link, including the sender.
        io.emit('newMessage', generateMessage(message.from, message.text)); //this is to emit the message to all the connected client, like real time chat

        callback('This is from the server.');
        //this will send to everyone but except the sender
        // socket.broadcast.emit('newMessage',{
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // });
    });

    socket.on('createLocationMessage', (coords) =>{
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
    });

    socket.on('disconnect', () =>{
        console.log('User was disconnected');
    });

}); //this is to register the event

server.listen(port, () =>{
    console.log(`Server is up on port ${port}`);
});



