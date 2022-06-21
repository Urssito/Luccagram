import React, {  useContext, useMemo, useState } from "react";
import io from 'socket.io-client';

export const SocketContext = React.createContext()

export function SocketProvider(props) {
    const [socket, setSocket] = useState(io(process.env.REACT_APP_SOCKET));

    const value = useMemo(() => {
        return({
            socket
        });
    }, [socket]);

    return <SocketContext.Provider value={value}>
        {props.children}
    </SocketContext.Provider>
}

export const useSocket = () => {
    const context = useContext(SocketContext);
    if(!context){
        throw new Error('useContext must be in SocketContext provider');
    }
    return context;
}