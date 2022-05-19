import React, {useEffect, useMemo, useContext, useState} from 'react';
import bcrypt from 'bcryptjs';

const UserContext = React.createContext(null);

export function UserProvider(props) {
    const [userState, setUser] = useState({});
    const [token, setToken] = useState('');

    const fetchUser = () => {
        if(document.cookie.includes('auth-token')){
            const cookies = document.cookie.split(';');
            cookies.map(cookie => {
                if(cookie.includes('auth-token')){
                    const token = cookie.split('=').pop();
                    setToken(token);
                    fetch(process.env.REACT_APP_HOST+'api/authenticate',{
                        headers: {
                            'auth-token': token,
                            'content-type': 'application/json'
                        }
                    })
                    .then(res => res.json())
                    .then(data => {
                        if(data.status === 'ok') {
                            setUser(data.resUser);
                        }else{
                            document.cookie = 'auth-cookie=;max-age=0';
                            setUser({errors: ['token invalido']})
                        }
                    })
                }
            })
        }
    }

    useEffect(() => {
        fetchUser();
    }, [document.cookie, window.location])

    const value = useMemo(() => {
        return ({
            userState,
            token
        })
    }, [userState, token])

    return <UserContext.Provider value={value}>
        {props.children}
    </UserContext.Provider>

}

export const useUser = () => {
    const context = useContext(UserContext);
    if(!context){
        throw new Error('useUser must be in UserContext provider');
    }
    return context;
}