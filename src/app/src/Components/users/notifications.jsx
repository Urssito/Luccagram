import React, { useContext } from 'react'
import Header from '../main/Header'
import Aside from '../main/aside'
import {SocketContext} from '../../Contexts/socket'

function Notifications() {

    const socket = useContext(SocketContext);

    return (
        <div id='app-body'>
            <React.StrictMode>
                <header>
                    <Header />
                </header>
                <div id="content">

                </div>
                <Aside />
            </React.StrictMode>
        </div>
    )
}

const Notification = () => {

}

export default Notifications;