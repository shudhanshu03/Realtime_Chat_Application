const socket =  io();

socket.on('message',(message)=>{
    console.log(message);
})

document.querySelector('#message-form').addEventListener('submit',(e)=>{
   e.preventDefault();
   const message = e.target.elements.message.value;  

   socket.emit('sendMessage',message);
})

document.querySelector('#send-location').addEventListener('click',()=>{
    if(!navigator.geolocation)
    {
        return alert('Location is not supported');
    }
    navigator.geolocation.getCurrentPosition((position)=>{
      console.log(position);
    })
})