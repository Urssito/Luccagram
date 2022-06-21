import React, { useContext, useEffect, useState } from "react";
import { NewPub } from "../publications/newPublications";
import Publication from "../publications/publication";
import Header from '../main/Header'
import "regenerator-runtime/runtime";
import Aside from "./aside";
import Loading from "../partials/loading";
import { useUser } from "../../Contexts/user";

function Home() {
    const {userState} = useUser();
    const [pubs, setPubs] = useState([]);
    const [loading, setLoading] = useState(true);

    const getPubs = async () => {
        const res = await fetch(process.env.REACT_APP_HOST+`api/getPubs`);
        const data = await res.json();
        if(data.status === 'ok'){
            setPubs(data.results);
            setLoading(false);
        }else{
            if(data.status === 'error'){
                console.log(data.error)
            }else{
                console.log('error desconocido')
                console.log('data: ', data)
            }
        }
    }

    useEffect(() => {
        getPubs();
    }, [userState]);

    if(!loading){
        return(
            <div id="app-body">
                <React.StrictMode>
                <header>
                    <Header />
                </header>
                <div id="content">
                    <div id="content-pos">
                        <div id='center'>
                            <div id="top-bar">
                                Inicio
                            </div>
                            <NewPub getPubs={getPubs} />
                            <Publication
                        pubs={pubs}/>
                        </div>
                        <Aside />
                    </div>
                </div>
                </React.StrictMode>
            </div>
        )
    }else{
        return <Loading />
    }
        
}

export default Home