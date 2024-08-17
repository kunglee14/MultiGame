const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// socket.io setup
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

io.on('connection', (socket) => {
    console.log('a user connected')
})

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

console.log("Server Loaded")

