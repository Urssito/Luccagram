import React from "react";

function NewPub() {

    return(
        <div id="new-pub">
            <form action="/api/upload" method="post">
                <div id="header-new-pub">
                    <div id="prof-pic-new-pub">
                        <img className="profilePhoto" src="/img/main/profilePhoto.jpg" alt="urssito"></img>
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
                            <button id="sbmtNewPub" type="submit" disabled>
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