import React, { useEffect } from "react";
import { useUser } from "../../Providers/user";

function NewPub() {
    const {userState, token} = useUser()
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
            console.log(data.errors)
        }
    }

    return(
        <div id="new-pub">
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
                            <button id="sbmtNewPub" onClick={sendPub}>
                                Subir
                            </button>
                        </div>
                    </div>
                </div>
            </form>
            <script type="module" src="/javascript/emojiBtn.js"></script>
        </div>
    )
}

export {NewPub}