import React, {useEffect} from "react";
import {ToastContainer, toast} from 'react-toastify';

export default function Notification ({notification}) {

    const Msg =({notification}) => (
    <>
        <strong>{notification.transmitter} dice</strong><br></br>
        <span>{notification.description}</span>
    </>
    )

    /*useEffect(() => {
        notification.map(noti => {
            toast.info(`<b>lucca</b>`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
        })
    });*/

    return(
        <>
        <button onClick={() => toast.info(<Msg notification={notification} />)}>notify</button>
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
        />
        </>
    )

}