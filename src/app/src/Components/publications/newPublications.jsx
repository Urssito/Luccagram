import React, { useState, useContext, useEffect } from "react";
import { useUser } from "../../Contexts/user";
import ErrorMsg from "../partials/error";

function NewPub({getPubs}) {
    const {userState} = useUser()
    const [token, setToken] = useState(null);
    const [errors, setErrors] = useState(null);
    const profilePic = userState.profilePicId ? 'http://drive.google.com/uc?export=view&id='+userState.profilePicId : '/img/main/profilePhoto.jpg'

    const sendPub = async () => {
        const {publication} = document.forms[0];
        console.log(publication.value)
        const res = await fetch('http://localhost:8080/api/upload', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'auth-token': token
            },
            body: JSON.stringify({
                publication: publication.value
            })
        });
        const data = await res.json();
        console.log(data)

        if(data.errors){
            setErrors(data.errors);
        }else{
            getPubs();
        }
    }

    useEffect(() => {
    const cookies = document.cookie.split(';')
    cookies.map(cookie => {
        if(cookie.indexOf('auth-token') !== -1){
            setToken(cookie.split('=').pop());
        }
    })
    })

    return(
        <div id="new-pub">
            {errors ? <ErrorMsg errors={errors} /> : ''}
            <form>
                <div id="header-new-pub">
                    <div id="prof-pic-new-pub">
                        <img className="profilePhoto" src={profilePic} alt="urssito"></img>
                    </div>
                    <div id="textarea-new-pub">
                        <textarea className="textarea" placeholder="¿Qué estás pensando?" name="publication" id="textareaNewPub"></textarea>
                    </div>
                </div>
                <div id="nav-new-pub-div">
                    <div id="nav-new-pub">
                        <div id="btn-new-pub">
                            <button type="button" id="emoji-trigger" className="btnNewPub">
                                <span className="material-icons">
                                    emoji_emotions
                                </span>
                            </button>
                            <label type="button" className="btnNewPub">
                                <span className="material-icons">
                                    image
                                </span>
                            </label>
                            <button type="button" className="btnNewPub">
                                <span className="material-icons">
                                    videocam
                                </span>
                            </button>
                        </div>
                        <div id="sbmt-new-pub">
                            <div id="sbmtNewPub" onClick={sendPub} >
                                Subir
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <script type="module" src="/javascript/emojiBtn.js"></script>
        </div>
    )
}

export {NewPub}