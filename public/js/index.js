let socket = io();

socket.on('connect', function (){
    console.log('Connected to server from client');

    // socket.emit('createEmail', {
    //     to: 'jen@example.com',
    //     text: 'Hey. this is Phyo'
    // });

    // socket.emit('createMessage', {
    //     to: 'jen@example.com',
    //     text: 'Hey. this is Phyo'
    // });
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
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });

    jQuery('#messages').append(html);

    
    // var li = jQuery('<li></li>');
    // li.text(`${message.from} ${formattedTime}: ${message.text}`);

    // jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function(message){
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: formattedTime
    });

    jQuery('#messages').append(html);

    // var li = jQuery('<li></li>');
    // //setting <a target="_blank" tells the browser to open new tab instead of opening on the same page.
    // var a = jQuery('<a target="_blank">My current location</a>');
    
    // //below code prevents injection melicious code than directly using template string on jQuery
    // li.text(`${message.from} ${formattedTime}: `);
    // a.attr('href', message.url);
    // li.append(a);

    // jQuery('#messages').append(li);
});

// socket.emit('createMessage', {
//     from: 'Frank',
//     text: 'Hi'
// }, function(data){// call back function to send back the ack
//     console.log('Got it',`data from server ${data}`);//Adding ack
// });

jQuery('#message-form').on('submit',function(event){
    event.preventDefault();

    let messageTextbox =  jQuery('[name=message]');

    socket.emit('createMessage',{
        from: 'User',
        text: messageTextbox.val()// selecting the name element and it's value
    }, function(){
        messageTextbox.val('');
    });
});

//jquery selector
var locationButton = jQuery('#send-location');
//this is same as below => jQuery('#send-location').on
locationButton.on('click', function(){
    //checking geolocation api exists on navigator on browser
    if(!navigator.geolocation){
        return alert('Geolocation not supported by your browser.');
    }

    locationButton.attr('disabled', 'disabled').text('Sending location...');

//this will actively get the location of the user.
    navigator.geolocation.getCurrentPosition(function(position){

        locationButton.removeAttr('disabled').text('Send location');//to remove the defined attribute
        socket.emit('createLocationMessage',{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }, function(){
        locationButton.removeAttr('disabled').text('Send location');//to remove the defined attribute
        alert('Unable to fetch location.');
    });
});
