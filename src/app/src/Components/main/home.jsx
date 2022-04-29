import React, { useEffect, useState } from "react";
import { Nav } from "./navigation";
import { NewPub } from "../publications/newPublications";
import Publication from "../publications/publication";
import Header from '../main/Header'
import "regenerator-runtime/runtime";

function Home() {
    const [pubs, setPubs] = useState([]);

    const getPubs = async () => {
        const res = await fetch(`http://localhost:8080/api/getPubs`);
        const data = await res.json();
        if(data.status === 'ok'){
            setPubs(data.results);
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
    }, []);

    return(
        <div id="app-body">
            <React.StrictMode>
            <header>
                <Header />
            </header>
            <div id="content">
                <div id="content-pos">
                    <div className='publications'>
                        <NewPub/>
                        <Publication
                    pubs={pubs}/>
                    </div>
                <div id="aside">
                    <div id="search-div">
                        <span className="material-icons">search</span>
                        <input id="search-input" type="text" placeholder="Buscar"/>
                    </div>
                    <div id="chats">
                        HOLA AQUI VAN A IR LOS CHATS UWU OWO EWE
                    </div>
                </div>
            </div>
                </div>
            </React.StrictMode>
        </div>
    )
        
}

export default Home