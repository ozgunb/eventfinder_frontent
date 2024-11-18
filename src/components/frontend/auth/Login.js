import React, {useState} from "react";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {setIsRegisterOpen, setToken} from "../../../redux/features/auth/authSlice";
import {setUser} from "../../../redux/features/auth/authSlice";

function Login() {

    const user = useSelector(state => state.user);
    const token = useSelector(state => state.token);
    const dispatch = useDispatch();

    const [loginForm, setLoginForm] = useState({
        email: 'ozgunb@gmail.com',
        password: '123456',
    });

    const handleInput = (e) => {
        setLoginForm({...loginForm, [e.target.name]: e.target.value});
    }

    const loginSubmit = (e) => {
        e.preventDefault();
        const data = {
            email: loginForm.email,
            password: loginForm.password,
        }
        axios.post('/api/login', data).then(res_login => {
            //console.log(res_login)
            if(res_login && res_login.data && res_login.data.success) {
                //console.log(res_login);
                if(res_login && res_login.data !== null && res_login.data.success === true) {
                    //console.log(res_login.data.token);
                    localStorage.setItem('token', res_login.data.token);
                    dispatch(setToken(res_login.data.token))

                    axios.get('/api/get_user?token=' + res_login.data.token).then(res => {
                        if(res && res.data && res.data.user !== null) {
                            console.log(res.data.user)
                            dispatch(setUser(res.data.user))
                        }
                    })
                }
            }
        })
    }

    const openRegisterForm = () => {
        dispatch(setIsRegisterOpen(true))
    }

    return (
        <div className="w-full my-4 md:pb-8">
            <div className="px-4">
                <div className="font-bold text-2xl mb-2">Giriş Yapın</div>
                <div className="text-sm mb-3">Giriş yaparak etkinliklerinizi bulun</div>
                <div>
                    <form onSubmit={loginSubmit}>
                        <div className="form-group mb-3">
                            <input type="" name="email" onChange={handleInput} value={loginForm.email}
                                   className="form-control" placeholder="Kullanıcı Adı"/>
                        </div>
                        <div className="form-group mb-3">
                            <input type="password" name="password" onChange={handleInput} value={loginForm.password}
                                   className="form-control" placeholder="Şifre"/>
                        </div>
                        <div className="form-group mb-3 w-full">
                            <button type="submit" className="btn btn-primary w-full">Giriş</button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="w-full flex justify-content-center items-center font-bold text-blue-600 cursor-pointer" onClick={openRegisterForm}>Hesap Oluştur</div>
        </div>
    );
}

export default Login;