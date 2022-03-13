import React , {Component} from "react";
import { Link } from "react-router-dom";

class Nav extends Component{
    constructor(props){
        super(props);
    }

    render(){
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
                <button type="button" className="navBtn">
                    <span className="material-icons">
                    expand_more
                    </span>
                </button>
                </div>
            </div>
            </nav>
        );
    }
    
}

export {Nav};