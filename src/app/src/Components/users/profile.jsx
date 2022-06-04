import { token } from 'morgan';
import React, { useEffect, useState } from 'react'
import { async } from 'regenerator-runtime';
import {useUser} from '../../Contexts/user.jsx'
import Aside from '../main/aside.jsx';
import Header from '../main/Header'
import Loading from '../partials/loading.jsx';
import Publication from '../publications/publication.jsx'

function Profile() {
    const {userState, token} = useUser();
    const [user, setUser] = useState(null);
    const [pubs, setPubs] = useState(null)
    const [loading, setLoading] = useState(true)
    const [followed, setFollowed] = useState(null);

    const getUser = async () => {
        const res = await fetch(process.env.REACT_APP_SERVER+'api/users', {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'get-user': window.location.href,
                'auth-token': token
            },
        });
        const data = await res.json();
        if(data.error){
            console.log(data.error);
        }else{
            if(data.user){
                setPubs(data.pubs);
                setUser(data.user);
            }
        }
    }

    const getFollowers = async() => {
        const res = await fetch(process.env.REACT_APP_SERVER+'api/follow',{
            method: 'GET',
            headers: {
                'auth-token':token,
                'user': user.user
            }
        })
        const data = await res.json();
        setFollowed(data.followed);
    }

    const follow = async () => {
            const res = await fetch(process.env.REACT_APP_SERVER+'api/follow', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'auth-token': token
                },
                body: JSON.stringify({
                    user: user.user
                })
            });
            const data = await res.json();
            setFollowed(data.followed);
    };

    useEffect(async() => {
        console.log(loading);
        if(user === null)getUser();
        if(followed === null && user !== null){
            await getFollowers();
            setLoading(false);
        }
    }, [user])

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
                                        <img className="profilePic" src={user ? process.env.REACT_APP_SERVER+user.profilePic : ''} alt={user.user} />
                                        <div id="profile-header-data">
                                            <div className="username-text">
                                                {user.user}
                                                {user.user === userState.user ? <a href="/profile/edit" className="a-normalize edit-profile-button">Editar perfil</a> : <Follow follow={follow} followed={followed} />}
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

const Follow = ({follow, followed}) => {

    if(!followed){
        return(
            <button onClick={follow} type="button" className="a-normalize follow-btn" id='follow'>
                <span className="material-icons">
                    person_add
                </span>
                Seguir
            </button>
        )
    }else{
        return(
            <button onClick={follow} type="button" className="a-normalize follow-btn" id='followed'>
                <span className="material-icons">
                    done
                </span>
                siguiendo
            </button>
        )
    }
}

export default Profile