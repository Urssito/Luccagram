import React from 'react'
import { useUser } from '../../Contexts/user';

function AsideL() {
    const {userState} = useUser();
    const height = window.innerHeight;
    let profilePic = null;
    if(userState){
        profilePic = userState.profilePicId ? 
        'http://drive.google.com/uc?export=view&id='+userState.profilePicId : 
        '/img/main/profilePhoto.jpg';
    }

    const logout = () => {
        localStorage.removeItem('userState');
        document.cookie.split(';').map(c => {
            if(c.indexOf('auth-token') !== -1){
                document.cookie = 'auth-token=; max-age=0'
            }
        })
        window.location.href = "/"
    }

    return (
        <div id='header' style={{height: `${height-57}px`}}>
            <div id="title">
                <a className='a-normalize' href="/">Luccagram</a>
            </div>
            <nav>
                <div id="nav-lspace"></div>
                <div id="nav-btns">
                    <a href='/' id="Home-btn" className='a-normalize header-btn'>
                    <span className="material-icons gicon">
                        home
                    </span>
                        Inicio
                    </a>
                    <a href={`/user/${userState.user}`} id="Profile-btn" className='a-normalize header-btn'>
                        <span className="material-icons gicon">
                            person
                        </span>
                        Perfil
                    </a>
                    <a href='/saves' id="Save-btn" className='a-normalize header-btn'>
                        <span className="material-icons">bookmark</span>
                        Guardar
                    </a>
                    <a href='/tema' id="theme-btn" className='a-normalize header-btn'>
                    <span className="material-icons">brush</span>
                        Tema
                    </a>
                    <button onClick={logout}>salir</button>
                </div>
            </nav>
            <div id="account">
                <div id="account-btn">
                <img id="account-pic" src={profilePic} alt={userState.user} />
                <div id="account-user">
                    {userState.user}
                </div>
                </div>
            </div>
        </div>
        
    )
}

export default AsideL