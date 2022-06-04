import React, {  useEffect, useState }  from 'react';
import Home from "./Components/main/home";
import Profile from "./Components/users/profile";
import Unlogged from "./Components/main/unlogged";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {UserProvider, useUser} from './Contexts/user'
import SignUp from './Components/users/signup';
import EditProfile from './Components/users/editProfile';
import {io} from 'socket.io-client';
 
export default () => <UserProvider props={null}>
        <App />
</UserProvider>

export function App () {
    const {token} = useUser();

    useEffect(() => {
        const socket = io(process.env.REACT_APP_SOCKET);
    },[]);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={
                    token ? 
                    <Home /> : 
                    <Unlogged />
                    } 
                    />
                <Route path="/user/*" element={<Profile />} />
                <Route path="/signup" element={<SignUp />}/>
                <Route path="/profile/edit" element={<EditProfile />} />
            </Routes>
        </BrowserRouter>
    )
    
}