import React, {useEffect, useMemo, useContext, useState} from 'react';

const UserContext = React.createContext(null);

export function UserProvider(props) {
    const [userState, setUser] = useState({});
    const [token, setToken] = useState('');

    const fetchUser = () => {
        if(token && Object.keys(userState).length === 0){
            fetch(process.env.REACT_APP_SERVER+'api/authenticate',{
                headers: {
                    'auth-token': token,
                    'content-type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(data => {
                if(data.status === 'ok') {
                    setUser(data.resUser);
                    if(!userState.profilePhoto) userState.profilePhoto = 'uploads/profilePhotos/default.jpg';
                }else{
                    document.cookie = 'auth-token=;secure;max-age=0;SameSite=None';
                }
            });
        }
           
    }

    const getToken = () => {
        const cookies = document.cookie.split(';');
        cookies.forEach(c => {
            if(c.includes('auth-token')){
                setToken(c.split('=').pop());
            }
        })
    }


    const value = useMemo(() => {
        getToken();
        fetchUser();
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