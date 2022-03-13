import React, { Component} from "react";
import { Nav } from "./Components/main/navigation";
import { NewPub } from "./Components/publications/newPublications";
import Publication from "./Components/publications/publication"
import "regenerator-runtime/runtime";

class Home extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            user: {},
            pubs: []
        }
    }

    async getPubs() {
        const res = await fetch('api/getPubs');
        const pubs = await res.json();
        this.setState({pubs});
    }

    async getUser() {
        const res = await fetch('api/authenticate');
        const user = await res.json();
        this.setState({user});
    }

    componentDidMount(){
        this.getUser();
        this.getPubs();
    }

    render() {
        return(
            <div id="app-body">
                <Nav />
                <React.StrictMode>
                <div id="asideL"></div>
                <div >
                    <NewPub/>
                    <Publication
                    user={this.state.user}
                    publications={this.state.pubs}/>
                </div>
                <div id="asideR"></div>
                </React.StrictMode>
            </div>
        )
        
    }
}

export default Home