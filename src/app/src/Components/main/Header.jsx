import React from 'react'
import { useUser } from '../../Providers/user'

function AsideL() {
    const { userState } = useUser()
    const height = window.innerHeight;
    const profilePic = userState.profilePicId ? 'http://drive.google.com/uc?export=view&id='+userState.profilePicId : '/img/main/profilePhoto.jpg'

    const logout = () => {
        sessionStorage.removeItem('userState');
        sessionStorage.removeItem('token');
        localStorage.removeItem('userState');
        localStorage.removeItem('token');
        window.location.reload()
    }

    return (
        <div id='header' style={{height: `${height-57}px`}}>
            <div id="title">
                Luccagram
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