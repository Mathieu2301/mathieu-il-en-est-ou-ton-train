var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 80;

app.use(require('express').static(__dirname + "/web"));

var log_message = "";
var bg_color = "#2A9032";
var percentage = 0;
var textarea_message = "";
var connected_users = 0;

io.on('connection', function(client){
  console.log("Connect : " + client)
  connected_users++;
  io.emit('connected_users', connected_users);

  client.emit('set_percentage', percentage);
  client.emit('set_log_msg', log_message);
  client.emit('bg_color_change', bg_color);
  client.emit('set_textarea', textarea_message);
  client.emit('alert', log_message);

  client.on('set_percentage', function(nbr){
    percentage = nbr;
    console.log("Percentage set to : " + percentage)
    io.emit('set_percentage', percentage);
  });

  client.on('set_log_msg', function(msg){
    log_message = msg;
    console.log("Login messaged changed to : " + log_message)
    io.emit('set_log_msg', log_message);
  });

  client.on('set_textarea', function(msg){
    textarea_message = msg;
    console.log("textarea_message = " + textarea_message)
    io.emit('set_textarea', textarea_message);
  });

  client.on('notify', function(msg){
    console.log("Notification sent : " + msg)
    io.emit('notify', msg);
  });

  client.on('bg_color_change', function(color){
    bg_color = color;
    io.emit('bg_color_change', bg_color);
  });
  
  client.on('poke', function(){
    console.log("Poke !")
    io.emit('poke');
  });

  client.on('refresh', function(){
    console.log("Refreshing")
    io.emit('refresh');
  });

  client.on('disconnect', function(){
    console.log("Disconnect : " + client)
    connected_users--;
    io.emit('connected_users', connected_users);
  });
});

server.listen(port, function(){
  console.log('listening on *:' + port);
});