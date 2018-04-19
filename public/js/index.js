let socket = io();

socket.on('connect', function (){
    console.log('Connected to server from client');

    // socket.emit('createEmail', {
    //     to: 'jen@example.com',
    //     text: 'Hey. this is Phyo'
    // });

    socket.emit('createMessage', {
        to: 'jen@example.com',
        text: 'Hey. this is Phyo'
    });
});

socket.on('disconnect',function () {
    console.log('Disconnected from server');
});

//to listen the custom event, we going to create the socket.on
//this is the listener of the new event from server
//first arg is the event name, must be same as the one at the server, 2nd arg is the data to receive from server
socket.on('newEmail', function(email) {
    console.log('New Email', email);
});

socket.on('newMessage', function(message){
    console.log('New message', message);
});
