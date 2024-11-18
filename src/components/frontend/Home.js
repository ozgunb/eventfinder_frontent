import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Login from "./auth/Login";
import Topbar from "./Topbar";
import {
    setEvents, setIsEventDetailOpen,
    setLatitude,
    setLongitude,
    setSelectedEvent,
    setUser,
    setZoom
} from "../../redux/features/auth/authSlice";
import {useDispatch, useSelector} from "react-redux";
import Register from "./auth/Register";
import {APIProvider, Map, Marker} from '@vis.gl/react-google-maps';
import Events from "./Events";
import EventDetail from "./EventDetail";

function Home() {

    useEffect( ()=> {
        getUser();
    }, []);


    const googleApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const curState = useSelector(state => state);
    const isRegisterOpen = useSelector(state => state.auth.isRegisterOpen);
    const isEventDetailOpen = useSelector(state => state.auth.isEventDetailOpen);
    const latitude = useSelector(state => state.auth.latitude);
    const longitude = useSelector(state => state.auth.longitude);
    const events = useSelector(state => state.auth.events);
    const zoom = useSelector(state => state.auth.zoom);
    const dispatch = useDispatch();

    const [isLocationSet, setIsLocationSet] = useState(false);

    const [map, setMap] = useState(null)

    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;

            console.log(latitude + ", " + longitude)

            if(!isLocationSet) {
                setIsLocationSet(true);
                dispatch(setLatitude(latitude))
                dispatch(setLongitude(longitude))
            }
        },
        () => {

        }
    );

    useEffect( ()=> {
        if(curState && curState.auth !== null && curState.auth.user !== null) {
            if(!isLoggedIn) {
                setIsLoggedIn(true);
            }
        }
        if(curState && curState.auth !== null && curState.auth.isRegisterOpen !== null && curState.auth.isRegisterOpen === true) {

        }
    }, [curState]);

    const getUser = () => {

        let token = localStorage.getItem('token');

        if(token !== null) {
            axios.get('/api/get_user?token=' + token).then(res => {
                if(res && res.data && res.data.user !== null) {
                    console.log(res.data.user)
                    dispatch(setUser(res.data.user))
                    setIsLoggedIn(true);
                }
            })
        } else {
            //Show login page
            setIsLoggedIn(false);
        }
    }

    const onZoomChanged = (newZoom) =>{
        dispatch(setZoom(newZoom))
    }

    const openEventDetail = (prmEvent) => {
        dispatch(setSelectedEvent(prmEvent))
        dispatch(setIsEventDetailOpen(true))
    }

    return (
        <div className="w-full" style={{height:"100svh"}}>
            <div className="w-full h-full bg-blue-300 relative">
                <Topbar className="z-50" style={{zIndex: 50}}/>
                <div className="flex flex-wrap h-full relative" style={{ height:"calc(100vh - 40px)" }}>
                    {!isLoggedIn && !isRegisterOpen &&
                        <div className="w-full md:w-1/4 md:h-full bg-white content-center z-50">
                            <Login className="w-full z-50"/>
                        </div>
                    }
                    {!isLoggedIn && isRegisterOpen &&
                        <div className="w-full md:w-1/4 md:h-full bg-white content-center z-50">
                            <Register className="w-full z-50"/>
                        </div>
                    }

                    {isLoggedIn &&
                        <div className="w-full md:w-1/4 md:h-full bg-white content-center z-50">
                            <Events className="w-full z-50"/>
                        </div>
                    }
                    {isLoggedIn && isEventDetailOpen &&
                        <div className="w-full md:w-1/4 md:h-full bg-white">
                            <EventDetail />
                        </div>
                    }

                    <div className={isLoggedIn && isEventDetailOpen ? "w-full md:w-2/4 h-full z-0" : "w-full md:w-3/4 h-full z-0"} style={{zIndex: 0}}>
                        <APIProvider apiKey={googleApiKey} style={{zIndex: 2}}>

                            <Map
                                defaultZoom={11}
                                disableDefaultUI
                                defaultCenter={{ lat: latitude, lng: longitude }}
                                options={{streetViewControl: false}}
                                gestureHandling={'greedy'}
                                onZoomChanged={(map) => onZoomChanged(map.detail.zoom)}
                            >
                                {events.map(event => {
                                    return (
                                        <Marker
                                            key={event.id}
                                            position={{ lat: parseFloat(event.latitude), lng: parseFloat(event.longitude) }}
                                            onClick={() => openEventDetail(event)}
                                        />
                                    );
                                })}
                                {/*<Marker*/}
                                {/*    position={{lat: 10, lng: 10}}*/}
                                {/*    clickable={true}*/}
                                {/*    onClick={() => alert('marker was clicked!')}*/}
                                {/*    title={'clickable google.maps.Marker'}*/}
                                {/*/>*/}

                            </Map>

                        </APIProvider>
                    </div>
                </div>


            </div>

        </div>
    );
}

export default Home;