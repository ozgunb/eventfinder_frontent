import React, {useState} from "react";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import { store } from "../../redux/app/store";
import {setToken} from "../../redux/features/auth/authSlice";
import { useNavigate } from 'react-router-dom';

function Topbar() {

    const curState = useSelector(state => state);

    const token = useSelector(state => state.auth.token);

    const navigate = useNavigate();
    const user = useSelector(state => state.auth.user);
    const dispatch = useDispatch();

    // console.log("ffff");
    // // console.log(token)
    // // console.log(store)
    //
    // console.log(JSON.stringify(curState));
    // console.log(JSON.stringify(user));

    const logoutClicked = (e) => {
        dispatch(setToken(null))
        localStorage.removeItem('token')
        //navigate('/', { replace: true })
        window.location.reload();
    }

    const goToMainPage = (e) => {
        navigate('/')
    }

    return (
        <div className="w-full h-full bg-gray-200 flex justify-between px-4 z-50" style={{height:"40px"}}>
            <div className="my-auto cursor-pointer" onClick={goToMainPage}>EventFinder</div>
            { user && <div className="my-auto">{ user ? user.name : "---"} (<span className="font-bold cursor-pointer" onClick={logoutClicked}>Çıkış</span>)</div> }
        </div>
    );
}

export default Topbar;