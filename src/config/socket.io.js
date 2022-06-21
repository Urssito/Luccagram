const modelUser = require('../models/users');
const modelNoti = require('../models/notifications');

let onlineUsers = [];

module.exports = (io) => {
    io.on('connection', (socket) => {

        socket.on('newUser', (data) => {
            const [user, userId, followers] = data;

            if(!onlineUsers.some(onUser => onUser.user === user)){
                const onlineUser = {
                    user,
                    userId,
                    followers
                };

                onlineUsers.push(onlineUser);
                console.log('user connected:', user)
            }
        });

        socket.on('follow', (data) => {
            const [follower, following] = data;

            socket.join(`${following} followers`);
            console.log(follower, 'siguió a', following);
            
        });

        socket.on('notification', (data) => {
            console.log('new notification in progress')
            const {transmitter, title, description, receiver} = data;
            console.log(data)

            const newNoti = new modelNoti({
                transmitter,
                title,
                description,
                receiver
            });
            newNoti.save();
            socket.broadcast.emit('newNotification', data)
        });

        socket.on('disconnected', (user) => {
            console.log('disconected:', user)
            onlineUsers = onlineUsers.filter(onUser => onUser.user !== user);
        })

    });
    io.listen(8081);
};