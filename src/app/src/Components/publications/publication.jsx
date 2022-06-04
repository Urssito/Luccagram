import React, { useEffect, useState } from 'react'
import "regenerator-runtime/runtime";
import { useUser } from '../../Contexts/user';

function Publication ({pubs}){
    const {userState, token} = useUser();

        return (
            <div id="div-publication">
                {
                    pubs.map((pub, i) => (
                        <div className="card-publication" key={pub._id}>
                            <h5 className="publication-header">
                                <div>
                                    <a href={'/user/' + pub.user} className="user">
                                        <img className="profilePhoto" src={process.env.REACT_APP_SERVER+pub.profilePic} alt={pub.user} />
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
                                user={userState}
                                pubID={pub._id} 
                                likesArray={pub.likes}
                                token={token} />
                            </div>
                        </div>
                    ))
                }
            </div>
        )
}

function Like({i, user, pubID, likesArray, token}) {
    const [liked, setLiked] = useState(null);
    const [likes, setLikes] = useState(likesArray.length);

    const likeCheckPost = async () => {
        setLiked(!liked)
        liked ? setLikes(likes - 1) : setLikes(likes+1);
        const res = await fetch(process.env.REACT_APP_SERVER+'api/like', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': token
            },
            body: JSON.stringify({
                pubID
            })
        });
        const data = await res.json();
        if(data.totalLikes.length > likes){
            setLikes(likes+1);
            setLiked(true)
        }else if(data.totalLikes.length < likes){
            setLikes(likes-1);
            setLiked(false);
        }
    }

    const getLikes = () => {
        if(user.likes){
            if(user.likes.includes(pubID)){
                setLiked(true)
            }else{
                setLiked(false)
            }
        }
    }
    
    useEffect(() => {
        if(liked === null)getLikes();
    }, [likes, liked, likesArray, user]);

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
                    id={'likeText'+ i}>{likes}
                </span>
            </label>
        </div>
    )
}

export default Publication