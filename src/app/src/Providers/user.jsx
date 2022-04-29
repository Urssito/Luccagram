import React, {useEffect, useMemo, useContext, useState} from 'react';

const UserContext = React.createContext(null);

export function UserProvider(props) {

    let userIntialState = null;
    if(sessionStorage.getItem('userState')){
        userIntialState = JSON.parse(sessionStorage.getItem('userState'))
    }if(localStorage.getItem('userState')){
        userIntialState = JSON.parse(localStorage.getItem('userState'))
    }

    let tokenIntialState = null;
    if(sessionStorage.getItem('token')){
        tokenIntialState = JSON.parse(sessionStorage.getItem('token'))
    }if(localStorage.getItem('token')){
        tokenIntialState = JSON.parse(localStorage.getItem('token'))
    }
    const [userState, setUser] = useState(userIntialState);
    const [token, setToken] = useState(tokenIntialState)

    useEffect(() => {
    }, [userState])

    const value = useMemo(() => {
        return ({
            userState,
            setUser,
            token,
            setToken,
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
