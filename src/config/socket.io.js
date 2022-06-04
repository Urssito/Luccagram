const {Server} = require('socket.io');

const io = new Server({
    cors: {
        origin: process.env.CLIENT_HOST,
    }
});

let onlineUsers = [];

const addUser = (user, socketId) => {
    !onlineUsers.some(onlineUser => onlineUser.user === user) &&
    onlineUsers.push({user, socketId});
};

const removeUser = (socketId) => {
    onlineUsers = onlineUsers.filter(user => user.socketId !== socketId);
};

const getUser = (user) => {
    return onlineUsers.find(onlineUser => onlineUser.user === user);
};

io.on('connection', (socket) => {

    socket.on('newUser', (user) => {
        addUser(user, socket.id);
    });

    socket.on('removeUser', () => {
        removeUser(socket.id);
    });

});

io.listen(8081);