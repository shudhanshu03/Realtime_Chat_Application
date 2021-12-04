const socket =  io();

const messageForm = document.querySelector('#message-form');
const messageFormInput = messageForm.querySelector('input');
const messageFormButton = messageForm.querySelector('button');
const sendLocationButton = document.querySelector('#send-location');
const messages = document.querySelector('#messages');


const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-message-template').innerHTML;



socket.on('message',(message)=>{
    console.log(message);
    const spage = Mustache.render(messageTemplate,{
       message:message.text,
       createdAt:moment(message.createdAt).format('h:mm a')

    });
    messages.insertAdjacentHTML("beforeend",spage);
})

socket.on('locationMessage',(url)=>{
    console.log(url);
    const lpage = Mustache.render(locationTemplate,{
        url:url
    })
    messages.insertAdjacentHTML('beforeend',lpage);
})


document.querySelector('#message-form').addEventListener('submit',(e)=>{
   e.preventDefault();
   messageFormButton.setAttribute('Disabled','disabled')
   const message = e.target.elements.message.value;  

   socket.emit('sendMessage',message,(feedback)=>{
       messageFormButton.removeAttribute('Disabled');
       messageFormInput.value = ''
       messageFormInput.focus();
       console.log('The Message was delivered',feedback);

   });
})

sendLocationButton.addEventListener('click',()=>{
    if(!navigator.geolocation)
    {
        return alert('Location is not supported');
    }
    sendLocationButton.setAttribute('Disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
      socket.emit('sendLocation',{
          lat: position.coords.latitude,
          long: position.coords.longitude
      },()=>{
          sendLocationButton.removeAttribute('Disabled');
          console.log('Location Shared')
      })
    })
})