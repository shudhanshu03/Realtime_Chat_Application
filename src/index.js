const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const {generateMessage} = require('./utilities/message')
const app = express();
const server = http.createServer(app);
const io = socketio(server)
const port  = process.env.PORT || 3000
const publicPath = path.join(__dirname,'../public');

app.use(express.static(publicPath));


io.on('connection',(socket)=>{
   console.log('New Connection');
   
   socket.emit('message',generateMessage('Welcome to this Chat Application'));
   socket.broadcast.emit('message',generateMessage('New User has Joined')); 
   
   socket.on('sendMessage',(message,callback)=>{
        io.emit('message',generateMessage(message));
        callback('Delivered');
   })

   socket.on('sendLocation',(coords,callback)=>{
        io.emit('locationMessage',`https://google.com/maps?q=${coords.lat},${coords.long}`)
        callback();
    })

   socket.on('disconnect',()=>{
       io.emit('message',generateMessage('A User has left'))
   })
   
})
server.listen(port,()=>{
    console.log(`Server is running on port: ${port}`)
})
