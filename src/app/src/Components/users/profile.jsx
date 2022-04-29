import React, { useEffect, useState } from 'react'
import {useUser} from '../../Providers/user.jsx'
import Publication from '../publications/publication.jsx'

function Profile() {
    const { userState } = useUser();
    const [user, setUser] = useState(null);
    const [pubs, setPubs] = useState()
    const [loading, setLoading] = useState(true)

    const getUser = async () => {
        const res = await fetch('http://localhost:8080/api/users', {
            method: 'GET',
            /*headers: {
                'content-type': 'application/json',
                'get-user': window.location.href,
            },*/
        });
        const data = await res.json();
        console.log(data)
        if(data.error){
            console.log(data.error);
        }else{
            if(data.user){
                setPubs(data.pubs);
                setUser(data.user);
                setLoading(false)
            }
        }
    }

    useEffect(() => {
        getUser();
    }, [])

    if(!loading){

        return (
        <div class='columns-3' id="profile-div">
            <div className="card profile-header">
            
                <div className="profile-header-div">
                    <img className="profilePic" src={user.profilePicId ? 
                                `http://drive.google.com/uc?export=view&id=${userState.profilePicId}`:
                                '/img/main/profilePhoto.jpg'} alt={userState.user} />
                    <span className="username-text">
                        <a href="/profile/edit" className="btn btn-primary edit-profile-button">Editar perfil</a>
                    </span>
                </div>
                <p className="profile-description"></p>
            </div>
            {/*user's publications*/}
            {pubs ?
                <div id="pubs-table">
                    <Publication pubs={pubs}></Publication>
                </div>
                :
                <div className="col-xs-12">
                        <div className="card mx-auto">
                            <div className="card-body">
                                <p className="lead">No publicaste nada :(</p>
                                <a href="/upload" className="btn btn-success btn-block">Publica algo!</a>
                            </div>
                        </div>
                </div>}
        </div>
    )
    }else{
        return <h1>cargando...</h1>
    }
}

export default Profile