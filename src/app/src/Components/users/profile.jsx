import React, { useEffect, useState } from 'react'
import {useUser} from '../../Contexts/user.jsx'
import Aside from '../main/aside.jsx';
import Header from '../main/Header'
import Loading from '../partials/loading.jsx';
import Publication from '../publications/publication.jsx'

function Profile() {
    const {userState} = useUser();
    const [user, setUser] = useState(null);
    const [pubs, setPubs] = useState(null)
    const [loading, setLoading] = useState(true)

    const getUser = async () => {
        const token = document.cookie.split(';').map(c => {
            if(c.includes('auth-token')){
                return c.split('=').pop()
            }
        })
        const res = await fetch('http://localhost:8080/api/users', {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'get-user': window.location.href,
                'auth-token': token
            },
        });
        const data = await res.json();
        console.log(userState)
        if(data.error){
            console.log(data.error);
        }else{
            if(data.user){
                setPubs(data.pubs);
                setUser(data.user);
                setLoading(false);
            }
        }
    }

    useEffect(() => {
        getUser();
    }, [])

    if(!loading){

        return (
            <div id="app-body">
                <React.StrictMode>
                    <header>
                        <Header />
                    </header>
                    <div id="content">
                        <div id="content-pos">
                            <div id="center">
                                <div id="top-bar">
                                    Perfil de {user.user}
                                </div>
                                <div className="profile-header">
        
                                    <div className="profile-header-div">
                                        <img className="profilePic" src={user.profilePic ? 'http://drive.google.com/uc?export=view&id='+user.profilePic : '/img/main/profilePhoto.jpg'} alt={user.user} />
                                        <div id="profile-header-data">
                                            <div className="username-text">
                                                {user.user}
                                                {user.user === userState.user ? <a href="/profile/edit" className="a-normalize edit-profile-button">Editar perfil</a> : ''}
                                            </div>
                                            <div className="profile-description">
                                                {user.description}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                            {/*<!-- user's publications -->*/}
                                <div className="publications-div">
                                    {pubs ? 
                                        <Publication pubs={pubs} /> :
                                        <div className="card mx-auto">
                                            <div className="card-body">
                                                <p className="lead">No publicaste nada :(</p>
                                                <a href="/upload" className="btn btn-success btn-block">Publica algo!</a>
                                            </div>
                                        </div>
                                    }
                                </div>
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

export default Profile