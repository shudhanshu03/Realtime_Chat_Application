const socket =  io();

const messageForm = document.querySelector('#message-form');
const messageFormInput = messageForm.querySelector('input');
const messageFormButton = messageForm.querySelector('button');
const sendLocationButton = document.querySelector('#send-location');
const messages = document.querySelector('#messages');


const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-message-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML
const {username,room } = Qs.parse(location.search,{ignoreQueryPrefix: true})

const autoscroll = ()=>{
  const newMessage = messages.lastElementChild
  const newMessagesStyles = getComputedStyle(newMessage)
  const newMessageMargin = parsecInt(newMessagesStyles.marginBottom)
  const newMessageHeight = newMessage.offsetHeight + newMessageMargin
  
  const visibleheight = messages.offsetHeight
  const containerheight = messages.scrollHeight
  
  const scrollOffset = messages.scrollTop + visibleheight

  if(containerheight - newMessageHeight <= scrollOffset)
  {
    messages.scrollTop = messages.scrollHeight
  }
  

}
socket.on('message',(message)=>{
    console.log(message);
    const spage = Mustache.render(messageTemplate,{
        username:message.username,
       message:message.text,
       createdAt:moment(message.createdAt).format('h:mm a')

    });
    messages.insertAdjacentHTML("beforeend",spage);
    autoscroll();
})

socket.on('locationMessage',(message)=>{
    console.log(message);
    const lpage = Mustache.render(locationTemplate,{
        username:message.username,
        url:message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    messages.insertAdjacentHTML('beforeend',lpage);
    autoscroll();
})

socket.on('roomData',({room,users})=>{
    const sidepage = Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = sidepage
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

socket.emit('join',{username,room},(error)=>{
    if(error)
    {
        alert(error)
        location.href = '/'
    }
})