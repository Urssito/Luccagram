import React, { useContext, useEffect, useState }  from 'react';
import Home from "./Components/main/home";
import Profile from "./Components/users/profile";
import Unlogged from "./Components/main/unlogged";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {UserProvider, useUser} from './Providers/user'
import SignUp from './Components/users/signup';
import axios from 'axios';

export default () => <UserProvider props={null}>
        <App />
</UserProvider>

export function App () {
    const {userState, token} = useUser()
    const [host, setHost] = useState('http://localhost:8080')
    let location = window.location.pathname;

    useEffect(() => {
        location = window.location.pathname
    }, [userState, token, location])

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={
                    userState ? 
                    <Home 
                        host={host}
                    /> : 
                    <Unlogged 
                        host={host} >
                        </Unlogged>
                    } 
                    />
                <Route path="/user/*" element={<Profile />} />
                <Route path="/signup" element={<SignUp />}/>
            </Routes>
        </BrowserRouter>
    )
    
}