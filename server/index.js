const http = require('http');
const fs = require('fs');
const path = require('path');
const server = http.createServer((req, res) => {
    if (req.url === '/') {
        // Serve index.html from the client folder
        res.writeHead(200, { 'Content-Type': 'text/html' });
        fs.createReadStream(path.join(__dirname, '../client/index.html')).pipe(res);
    } else if (req.url.endsWith('.js')) {
        // Serve JavaScript files (client.js)
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
        fs.createReadStream(path.join(__dirname, '../client', req.url)).pipe(res);
    }
    else if (req.url === '/styles.css') {
        res.writeHead(200, { 'Content-Type': 'text/css' });
        fs.createReadStream(path.join(__dirname, '../client/styles.css')).pipe(res);
    } else {
        // Handle other static files (like stylesheets, images, etc.)
        res.writeHead(404);
        res.end();
    }
});

let users = {};

const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log('a user connected!');

    socket.on('setName', (name) => {
        users[socket.id] = name;
    })

    socket.on('message', (msg) => {
        const userName = users[socket.id] || 'Anonymous'; // Use the stored name or 'Anonymous'
        console.log(`${userName}: ${msg}`); // Log the message with the user's name
        io.emit('message', `${userName}: ${msg}`);
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        console.log('a user disconnected!');
        delete users[socket.id]; // Remove the user from the 'users' object when they disconnect
    });


});



io.on('disconnect', (socket) => {
    console.log('a user disconnected!');
})

server.listen(25565,'0.0.0.0', () => {
    console.log('Server listening on port 25565');
});
