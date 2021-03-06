const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');//to set up the server to communicate server and client two ways

const {generateMessage} = require('./utils/message');
const {generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);// get the web socket server, now ready to connect the connection
let users = new Users();

app.use(express.static(publicPath));//setting the public folder

io.on('connection', (socket) =>{//this socket is similar to client socket
    console.log('New user conneccted');    

    socket.on('join', (params, callback)=>{
        if(!isRealString(params.name) || !isRealString(params.room)){
            return callback('Name and room name are required.');
        }

        //joining the socket room
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        socket.emit('newMessage', generateMessage('Admin','Welcome to the chat app'));
        socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',`${params.name} has joined.`));
        
        callback();
        // io.emit // will emit to everyone who's connected
        // io.to('Room Name').emit // everyone in this room
        // socket.broadcast.emit // will emit to everyone connected to socket server except the user
        // socket.broadcast.to('Room name').emit// everyone in the room except for the user who sent
        // socket.emit//emit to one user
        //leaving the socket room
        // socket.leave(roomName)        
    });

    socket.on('createMessage',(message, callback) =>{//callback is to ack
        let user = users.get(socket.id);

        if(user && isRealString(message.text)){
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text)); //this is to emit the message to all the connected client, like real time chat
        }
        
        callback();
        
        // console.log('createMessage', message);
        //io.emit will send message to everyone who is listening to same link, including the sender.
       
        //this will send to everyone but except the sender
        // socket.broadcast.emit('newMessage',{
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // });
    });

    socket.on('createLocationMessage', (coords) =>{
        let user = users.get(socket.id);

        if(user){            
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }

        
    });

    socket.on('disconnect', () =>{
        let user = users.removeUser(socket.id);

        if(user){
            io.to(user.room).emit('updateUserList',users.getUserList(user.room));
            io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left.`));
        }
        
        // console.log('User was disconnected');

    });

    // socket.emit('newMessage', generateMessage('Admin','Welcome to the chat app'));

    // socket.broadcast.emit('newMessage',generateMessage('Admin','New user joined'));

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

}); //this is to register the event

server.listen(port, () =>{
    console.log(`Server is up on port ${port}`);
});



