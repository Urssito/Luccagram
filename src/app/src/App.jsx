import React, { useEffect, useState } from 'react';
import Home from "./Components/main/home";
import Profile from "./Components/users/profile";
import Unlogged from "./Components/main/unlogged";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {UserProvider, useUser} from './Contexts/user'
import SignUp from './Components/users/signup';
import {SocketProvider, useSocket} from './Contexts/socket'
import EditProfile from './Components/users/editProfile';
import Notifications from './Components/users/notifications';
import NotiMsg from './Components/partials/notification'
 
export default () => <UserProvider props={null}>
    <SocketProvider props={null}>
        <App />
    </SocketProvider>
</UserProvider>

export function App () {
    const {userState, token} = useUser();
    const {socket} = useSocket();
    const [notifications, setNotifications] = useState(null);

    useEffect(() => {
        socket.on('newNotification',(data) => {
            const {transmitter, title, description, receiver} = data;
            if(receiver.includes(userState.id))setNotifications(...notifications, {transmitter, title, description})
        });
    }, [userState])

    useEffect(() => {
        if(socket && userState.id){
            socket.emit('newUser', [userState.user, userState.id, userState.followers])
        }
    }, [socket, userState]);

    return (
        <BrowserRouter>
            <NotiMsg notification={{transmitter:'urssito', title:'publicacion', description:'hola!'}} />
            <Routes>
                <Route path="/" element={
                    token ? 
                    <Home /> : 
                    <Unlogged />
                    } 
                    />
                <Route path="/user/*" element={<Profile />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/signup" element={<SignUp />}/>
                <Route path="/profile/edit" element={<EditProfile />} />
            </Routes>
        </BrowserRouter>
    )
    
}