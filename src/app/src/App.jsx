import React, {  useEffect, useState }  from 'react';
import Home from "./Components/main/home";
import Profile from "./Components/users/profile";
import Unlogged from "./Components/main/unlogged";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {UserProvider, useUser} from './Contexts/user'
import SignUp from './Components/users/signup';
import EditProfile from './Components/users/editProfile'

export default () => <UserProvider props={null}>
        <App />
</UserProvider>

export function App () {
    const {userState} = useUser()
    const [loged, setLoged] = useState(false);
    const [token, setToken] = useState(null)

    useEffect(() => {
        if(!document.cookie.includes(token)){
            const cookies = document.cookie.split(';');
            cookies.map(cookie => {
                if(cookie.indexOf('auth-token') !== -1){
                    setToken(cookie.split('=').pop());
                    setLoged(true)
                }else{
                    setLoged(false)
                }
            })
        }
    }, [document.cookie])

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={
                    loged ? 
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



/*import React, { useContext, useEffect, useState }  from 'react';
import Home from "./Components/main/home";
import Profile from "./Components/users/profile";
import Unlogged from "./Components/main/unlogged";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from './Components/users/signup';

export default () => <UserProvider props={null}>
        <App />
</UserProvider>

export function App () {
    const [host, setHost] = useState('http://localhost:8080')
    let location = window.location.pathname;

    useEffect(() => {
        if(!document.cookie.includes(token)){
            console.log(token)
            const cookies = document.cookie.split(';');
            cookies.map(cookie => {
                if(cookie.indexOf('auth-token') !== -1){
                    setToken(cookie.split('=').pop());
                    setLoged(true)
                }else{
                    setLoged(false)
                }
            })
        }
    }, [document.cookie])

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={
                    loged ? 
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
*/