const socket = io('http://10.0.0.10:25565');

// Prompt for the user to enter their name when they first connect
let userName = prompt("Enter your name:");

// Send the name to the server as soon as the connection is established
socket.emit('setName', userName);

socket.on('message', (msg) => {
    console.log('Message from server:', msg);
    const el = document.createElement('li');
    el.innerHTML = msg;
    document.querySelector('ul').appendChild(el);
});

document.querySelector('button#send').onclick = () => {
    const text = document.querySelector('input').value;
    if (text.trim()) {
        socket.emit('message', text);
        document.querySelector('input').value = ''; // Clear input after sending
    }
};
