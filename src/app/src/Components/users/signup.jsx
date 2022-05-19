import React, { useState } from 'react'
import ErrorMsg from '../partials/error';
import { useUser } from '../../Contexts/user';

function SignUp() {
    const {setUser, setToken} = useUser()
    const [errors, setErrors] = useState(null)//array

    const signUp = async (e) => {
        e.preventDefault()
        
        setErrors(null)
        const {user, password, confirmPassword, email} = document.forms[0];

        const res = await fetch(`http://localhost:8080/api/signup`,{
            method: 'POST',
            body: JSON.stringify({
                user: user.value, 
                password: password.value,
                confirmPassword: confirmPassword.value,
                email: email.value
            }),
            headers: {
                'content-type': 'application/json'
            }
        });
        const data = await res.json();
        console.log(data)

        if(data.errors){
            setErrors(data.errors);
        }else{
            setUser(data.user);
            setToken(data.token);
            sessionStorage.setItem('userState', JSON.stringify(data.user));
            sessionStorage.setItem('token', JSON.stringify(data.token));
            window.location.pathname = '/';
        }

    }

    return (
        <div className="row">
            {errors ? <ErrorMsg errors={errors} /> : '' }
            <div className="col-md-4 mx-auto">
                <div className="card">
                    <div className="card-header">
                        Registro
                    </div>
                    <div className="card-body">
                        <form>
                            <div className="form-group">
                                <input type="text" name="user" className="form-control" placeholder="usuario" />
                            </div>
                            <div className="form-group">
                                <input type="password" name="password" className="form-control" placeholder="contraseña"/>
                            </div>
                            <div className="form-group">
                                <input type="password" name="confirmPassword" className="form-control" placeholder="confirme su contraseña"/>
                            </div>
                            <div className="form-group">
                                <input type="email" name="email" className="form-control" placeholder="correo" />
                            </div>
                            <div className="form-group">
                                <button onClick={signUp} type="submit" className="btn btn-primary btn-block">
                                    Registrarse
                                </button>
                            </div>
                        </form>
                        <div id="signup-op-divisor">
                            <div className='signup-op-line'></div>
                            <div>o</div>
                            <div className='signup-op-line'></div>
                        </div>
                    </div>
                    <div id='signup-op-div'>
                        <button>Gluglu</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUp