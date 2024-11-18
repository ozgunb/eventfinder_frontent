import React, {useState} from "react";
import axios from "axios";
import {setIsRegisterOpen, setToken, setUser} from "../../../redux/features/auth/authSlice";
import {useDispatch} from "react-redux";

function Register() {

    const [registerForm, setRegisterForm] = useState({
        name: '',
        email: '',
        password: '',
    });

    const dispatch = useDispatch();

    const handleInput = (e) => {
        setRegisterForm({...registerForm, [e.target.name]: e.target.value});
    }

    const registerSubmit = (e) => {
        e.preventDefault();
        const data = {
            name: registerForm.name,
            email: registerForm.email,
            password: registerForm.password,
        }
        axios.post('/api/register', data).then(res => {
            console.log(res)
            if(res && res.data && res.data.success) {
                console.log("kayıt yapıldı");
                axios.post('/api/login', data).then(res_login => {
                    console.log(res_login)
                    if(res_login && res_login.data && res_login.data.success) {
                        console.log(res_login)

                        localStorage.setItem('token', res_login.data.token);
                        dispatch(setToken(res_login.data.token))

                        axios.get('/api/get_user?token=' + res_login.data.token).then(res => {
                            if(res && res.data && res.data.user !== null) {
                                console.log(res.data.user)
                                dispatch(setUser(res.data.user))
                            }
                        })
                    }
                })
            }
        })
    }

    const openLoginForm = () => {
        dispatch(setIsRegisterOpen(false))
    }

    return (
        <div className="w-full my-4 md:pb-8">
            <div className="px-4">
                <div className="font-bold text-2xl mb-2">Kayıt Olun</div>
                <div>
                    <form onSubmit={registerSubmit}>
                        <div className="form-group mb-3">
                            <label>Ad Soyad</label>
                            <input type="" name="name" onChange={handleInput} value={registerForm.name}
                                   className="form-control"/>
                        </div>
                        <div className="form-group mb-3">
                            <label>Email</label>
                            <input type="" name="email" onChange={handleInput} value={registerForm.email}
                                   className="form-control"/>
                        </div>
                        <div className="form-group mb-3">
                            <label>Şifre</label>
                            <input type="" name="password" onChange={handleInput} value={registerForm.password}
                                   className="form-control"/>
                        </div>
                        <div className="form-group mb-3">
                            <button type="submit" className="btn btn-primary w-full">Kayıt Ol</button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="w-full flex justify-content-center items-center font-bold text-blue-600 cursor-pointer"
                 onClick={openLoginForm}>Giriş Yap
            </div>
        </div>
    );
}

export default Register;