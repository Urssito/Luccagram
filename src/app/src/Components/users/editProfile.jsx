import React, { useEffect, useState } from 'react'
import { useUser } from '../../Contexts/user'
import Aside from '../main/aside'
import Header from '../main/Header'
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import ErrorMsg from '../partials/error';

function EditProfile() {
    const {userState, token} = useUser();
    const [dim, setDim] = useState([]);
    const [cropper, setCropper] = useState();
    const [image, setImage] = useState();
    const [errors, setErrors] = useState([]);

    const getData = () => {
        if(document.getElementById('file').files.length){
            const cropSize = Math.round(cropper.cropper.cropBoxData.width);
            const percentSize = (cropSize * 100)/ cropper.cropper.containerData.width;
            const cropTop = Math.round(cropper.cropper.cropBoxData.top);
            const percentTop = (cropTop *100)/cropper.cropper.containerData.height;
            const cropLeft = Math.round(cropper.cropper.cropBoxData.left);
            const percentLeft = (cropLeft *100)/cropper.cropper.containerData.width;
            const imgDim = [
                Math.round(cropper.width*(percentLeft/100)),
                Math.round(cropper.height*(percentTop/100)),
                Math.round(cropper.width*(percentSize/100))
            ]
            setDim(imgDim)
            console.log(imgDim)
        }
        console.log(cropper)    
    }

    const change = (e) => {
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
        files = e.dataTransfer.files;
        } else if (e.target) {
        files = e.target.files;
        }
        const reader = new FileReader();
        reader.onload = () => {
        setImage(reader.result);
        };
        reader.readAsDataURL(files[0]);
        const editor = document.getElementById('editor');
        editor.firstChild.setAttribute('id', 'cropper');
        editor.classList.remove('hide');
        document.getElementById('cropper-save').classList.remove('hide');
        document.getElementById('cropper-delete').classList.remove('hide');
        editor.classList.remove('disabled');
        document.getElementById('cropper-save').classList.remove('disabled');
        document.getElementById('cropper-delete').classList.remove('disabled');
        getData();
    };

    const sendCropData = async (e) => {
            e.preventDefault();
            const form = document.forms[0];
            console.log(form)
            const formData = new FormData(form);
            formData.append('imgDim', dim)

            const res = await fetch('http://localhost:8080/profile/editsuccess',{
                method: 'PUT',
                body: formData,
                headers:{
                    'auth-token': token
                }
            });
            const data = await res.json();
            if(data.errors) setErrors([...data.errors]);
            else {
                const oldUser = await JSON.parse(JSON.stringify(userState));
                oldUser.user = data.user;
                oldUser.description = data.description;
                if(data.profilePicId)oldUser.profilePicId = data.profilePicId;
                console.log(userState)
                window.location.pathname = `user/${data.user}`
            }
    }

    const cropperHide = (e) => {
        document.getElementById('editor').classList.add('hide');
        document.getElementById('cropper-delete').classList.add('hide');
        e.target.classList.add('hide');
    }

    const cropperRemove = (e) => {
        document.getElementById('cropper-save').classList.add('hide');
        document.getElementById('editor').classList.add('disabled');
        e.target.classList.add('disabled');
    }

    return(
        <div id="app-body">
            {errors.length > 0 ? <ErrorMsg errors={errors} /> : ''}
            <React.StrictMode>
                <header>
                    <Header />
                </header>
                <div id="content">
                    <div id="content-pos">
                        <div id="center">
                        <div className="edit-profile-div">

                            <form id="formFile">
                                
                                
                                <div className="edit-profile-progress-div progress">
                                    <div id="progress" className="progress-bar progress-bar-striped" role="progressbar" ></div>
                                </div>

                                <div className="edit-profile-title">Editar perfil</div>

                                <div className="form-group edit-profile-group">
                                    <span className="edit-profile-element">Cambiar nombre de usuario</span>
                                    <input type="text" name="user" placeholder="usuario" defaultValue={userState.user} />
                                </div>

                                <div className="form-group edit-profile-group">
                                    <div className="edit-profile-file-form">
                                        {/*<!-- cut image scripts -->*/}

                                        <link href="/css/cropper.css" type='text/css' rel="stylesheet" />
                                        <script src="/javascript/cropper.js" />
                                        {/*<!-- input -->*/}
                                        <span className="edit-profile-element" id="edit-profile-title-porfilePic">Cambiar foto de Perfil</span>
                                        <div className="preview-div">
                                            {/*<!-- Preview -->*/}
                                            <div id="editor" className='hide' onClick={getData}>
                                                <Cropper
                                                    src={image}
                                                    style={{ height: '100%', maxWidth: '100%' }}
                                                    // Cropper.js options
                                                    guides={false}
                                                    aspectRatio={1}
                                                    autoCropArea={0}
                                                    toggleDragModeOnDblclick={false}
                                                    zoomOnWheel={false}
                                                    background={false}
                                                    ref={instance => {
                                                        setCropper(instance)
                                                    }}
                                                />
                                            </div>
                                            <input onChange={change} id="file" className="edit-profile-element" accept="image/*" type="file" name="image" />
                                            <div id="div-editor-buttons">
                                                <input value='Guardar' type='button' id='cropper-save' className='hide editor-btn' onClick={cropperHide} />
                                                <label id='cropper-search' htmlFor="file" className="editor-btn">
                                                    <span className="material-icons">
                                                        file_upload
                                                    </span>
                                                    Examinar
                                                </label>
                                                <input value='Borrar' type='button' id='cropper-delete' className='hide editor-btn' onClick={cropperRemove} />
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group edit-profile-group">
                                    <span className="edit-profile-element">Descripción</span>
                                    <textarea className="edit-profile-element" name="description" defaultValue={userState.description} cols="60" rows="5" placeholder="Cuentanos de ti..."/>
                                </div>

                                <div className="form-group edit-profile-submit-div">
                                <input onMouseEnter={() => {
                                    if(dim.length === 0 && document.querySelector('#file').files.length)getData();
                                }} onClick={sendCropData} type="submit" value="Guardar" className="edit-profile-submit" />
                                </div>

                            </form>

                            </div>
                        </div>
                        <Aside />
                    </div>
                </div>
            </React.StrictMode>
        </div>
    )
}

export default EditProfile