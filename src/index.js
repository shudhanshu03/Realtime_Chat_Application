const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const {generateMessage,generateLocationMessage} = require('./utilities/message')

const {addUser,removeUser,getUser,getUserInRoom} = require('./utilities/users')


const app = express();
const server = http.createServer(app);
const io = socketio(server)
const port  = process.env.PORT || 3000
const publicPath = path.join(__dirname,'../public');

app.use(express.static(publicPath));


io.on('connection',(socket)=>{
   console.log('New Connection');
   
   
   socket.on('join',(options,callback)=>{
       const {error,user} = addUser({id:socket.id,...options})
       if(error)
       {
          return callback(error)
       }
       socket.join(user.room)

       socket.emit('message',generateMessage('Welcome to this Chat Application'));
       socket.broadcast.to(user.room).emit('message',generateMessage(`${user.username} has joined`)); 
       io.to(user.room).emit('roomData',{
           room:user.room,
           users:getUserInRoom(user.room)
       })
       callback()
   })

   socket.on('sendMessage',(message,callback)=>{
       const user = getUser(socket.id);

        io.to(user.room).emit('message',generateMessage(user.username,message));
        callback('Delivered');
   })

   socket.on('sendLocation',(coords,callback)=>{
       const user = getUser(socket.id);
        io.to(user.room).emit('locationMessage',generateLocationMessage(user.username,`https://google.com/maps?q=${coords.lat},${coords.long}`))
        callback();
    })

   socket.on('disconnect',()=>{
       const user = removeUser(socket.id)
       if(user)
       {
        io.to(user.room).emit('message',generateMessage(`${user.username} has left the chat`))
        io.to(user.room).emit('roomData',{
            room:user.room,
            users: getUserInRoom(user.room)
        })
       }
   })
   
})
server.listen(port,()=>{
    console.log(`Server is running on port: ${port}`)
})
