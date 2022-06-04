import React, { useEffect, useState } from 'react';

import { useUser } from '../../Contexts/user';
import ErrorMsg from '../partials/error';

export function Unlogged () {
    const {userState} = useUser();
    const [errors, setErrors] = useState([])

    useEffect(() => {
        if(userState && userState.errors) setErrors(userState.errors);
    }, [userState]);

    async function logging(e){
        e.preventDefault()

        const {user, password, remember} = document.forms[0];

        const res = await fetch(process.env.REACT_APP_SERVER+`api/login`,{
            method: 'POST',
            body: JSON.stringify({
                user: user.value, 
                password: password.value
            }),
            headers: {
                'content-type': 'application/json'
            }
        })
        const data = await res.json();
        console.log(data)
            if (data.errors){
                setErrors(data.errors)
            }else{
                if(remember.checked){
                    document.cookie += "auth-token=" + data.token + ";max-age" + 60*60*24*365*100 + ";secure";
                }else{
                    document.cookie += "auth-token=" + data.token + ";secure";
                }
                window.location.reload();
            }
    }

    const forgotPassword = () => {}

    return (
        <div className="m-0 row justify-content-center login-card">
            <div className="col-md-4 mx-auto">
                {errors ? <ErrorMsg errors={errors} /> : '' }
                <div className="card col d-flex justify-content-center">
                    <div className="card-header">
                        Ingresá
                    </div>
                    <div className="card-body">
                        <form id="login-form">
                            <div className="form-group">
                                <input id="user-input" type="text" name="user" className="form-control" placeholder="usuario o email" autoFocus />
                            </div>
                            <div className="form-group">
                                <input id="password-input" type="password" name="password" className="form-control" placeholder="contraseña" />
                            </div>
                            <div className="form-group">
                                <button onClick={logging} className="btn btn-primary btn-block">
                                    Ingresar
                                </button>
                            </div>
                            <div className="form-group">
                                <input type="checkbox" id="rem" name="remember" /> <label htmlFor="rem" style={{fontSize: "14px"}} >Mantener sesión iniciada</label>
                            </div>
                            <div className="form-group">
                                <a className="d-flex w-50" style={{fontSize: "12px", float: "left"}}>¿Olvidaste tu contraseña?</a>
                                <a href='/signup' className="d-flex w-50" style={{fontSize: "12px", float: "right", justifyContent: "right"}}>Registrarse</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Unlogged