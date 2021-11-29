const socket =  io();

socket.on('countupdated',(count)=>{
    console.log('Count updated',count);
})

document.querySelector('#increment').addEventListener('click',()=>{
    console.log('Clicked')
    socket.emit('increment');
})