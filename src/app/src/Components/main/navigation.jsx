import React , {useState} from "react";
import { Link } from "react-router-dom";

function Nav (){
    const [dropDown, setdropDown] = useState(false)

    const openDropDown = () => {
        setdropDown(!dropDown);
    }
    window.onclick = (e) => {
        if(dropDown && e.target.parentNode.classList[0] !== 'dropBtn'){
            if(e.target.id !== 'nav-dropdown'){
                setdropDown(false)
            }
        }
    }

    const logout = async () => {
        sessionStorage.removeItem('userState');
        sessionStorage.removeItem('token');
        localStorage.removeItem('userState');
        localStorage.removeItem('token');
        window.location.reload()
    }

    return (
        <nav>
            <div id="nav-items">

                {/* <!-- Titulo -->*/}
                <span id="title"><a className="a-normalize" href="/">Luccagram</a></span>

                {/*<!-- Search Bar -->*/}
                <div id="div-search">
                <input autoComplete="off" type="text"  name="search" id="search" placeholder="buscar"></input>
                <div id="searchResults">

                </div>
                </div>
                <script src="/javascript/browser.js"></script>

                {/*<!-- nav Menu -->*/}
                <div id="div-nav-btns">
                    <button type="button" className="navBtn">
                        <span className="material-icons">
                        home
                        </span>
                    </button>
                    <button type="button" className="navBtn">
                        <span className="material-icons">
                        favorite_border
                        </span>
                    </button>
                    <button type="button" className="navBtn">
                        <Link className="a-normalize" to="/user/urssito">
                            <span className="material-icons">
                                account_circle
                            </span>
                        </Link>
                    </button>
                    <button type="button" className="navBtn">
                        <span className="material-icons">
                        chat_bubble
                        </span>
                    </button>
                    <div className='dropdown' >
                        <button onClick={openDropDown} className="dropBtn navBtn">
                            <span className="material-icons">
                                expand_more
                            </span>
                        </button>
                        <div id="nav-dropdown" className={dropDown ? 'dropdown-content show' : 'dropdown-content'}>
                            <a  onClick={logout}>logout</a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
    
}

export {Nav};