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
                                        <img className="profilePhoto" src={pub.profilePic ? 'http://drive.google.com/uc?export=view&id='+pub.profilePic : '/img/main/profilePhoto.jpg'} alt={pub.user} />
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
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState([...likesArray] || []);

    const likeCheckPost = async () => {
        const res = await fetch('http://localhost:8080/api/like', {
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
        setLikes(data.totalLikes);
        if(data.totalLikes.length > likes.length){
            user.likes.push(pubID);
        }else{
            for(let i = 0;i<user.likes.length;i++){
                if(user.likes[i] == pubID){
                    user.likes.splice(i,1);
                }
            }
        }
    }
    
    useEffect(() => {
        if(user.likes){
            if(likes.length === 0){
                setLiked(false)
            }
            if(user.likes.includes(pubID)){
                setLiked(true)
            }else{
                setLiked(false)
            }
        }
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
                    id={'likeText'+ i}>{likes.length}
                </span>
            </label>
        </div>
    )
}

export default Publication