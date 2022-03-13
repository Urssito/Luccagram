import React, { Component, useEffect, useState } from 'react'
import "regenerator-runtime/runtime";

export class Publication extends Component{
    
    async likeCheckPost(pubID){
        const res = await fetch('api/home', {
            method: 'POST',
            data: {user: this.props.user,pubID}
        });
        const data = await res.json();
        console.log(data);
    }

    render() {
        return (
            <div id="div-publication">
                {
                    this.props.publications.map((pub, i) => (
                        <div className="card-publication" key={pub._id}>
                            <h5 className="publication-header">
                                <div>
                                    <a href={'/user/' + pub.user} className="user">
                                        <img className="profilePhoto" src="/img/main/profilePhoto.jpg" alt={pub.user} />
                                        <b>{pub.user}</b>
                                    </a>
                                </div>
                            </h5>
                            <div className="div-content">
                                <p className="publication-body">
                                    {pub.publication}
                                </p>
                            </div>
                            <div id="interactions">
                                <Like
                                i={i}
                                user={this.props.user.user}
                                pubID={pub._id} 
                                likesArray={pub.likes} />
                            </div>
                        </div>
                    ))
                }
            </div>
        )
  }
}

function Like({i, user, pubID, likesArray}) {
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState([]);
    let likeMount = false;

    const likeCheckPost = async () => {
        const res = await fetch('api/home', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                user,
                pubID
            })
        });
        const data = await res.json();
        setLikes(data.totalLikes);
    }

    const heartIcon = () => {
        if(likes.includes(user)){
            return 'favorite_border'
        }else{
            return 'favorite'
        }
    }
    
    useEffect(async () => {
        if(!likeMount && likes.length == 0){
            setLikes(likesArray)
            likeMount = true;
        }
        if(likes.includes(user)){
            setLiked(true)
        }else{
            setLiked(false)
        }
    }, [likes, liked]);

    return(
        <div className="div-like">
            <input id={'likeBtn'+ i}
            className="likeBtn"
            name="like"
            type='checkbox'
            onClick={likeCheckPost}
            defaultChecked={liked}
            />
            <label htmlFor={'likeBtn'+i}>
                <i
                className='material-icons heart-icon disable-select'
                style={
                    liked
                    ? {color: '#f00'}
                    : {color: 'rgba(0,0,0,.5)'}
                }
                id={'heart-icon'+ i}
                >
                    {
                        liked ? 'favorite' : 'favorite_border'
                    }
                </i>
                <span
                    className='interaction-text disable-select'
                    id={'likeText'+ i}>{likes.length}
                </span>
            </label>
        </div>
    )
}

export default Publication