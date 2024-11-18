import React, {useState} from "react";
import axios from "axios";
import {setIsRegisterOpen, setToken, setUser} from "../../redux/features/auth/authSlice";
import {useDispatch, useSelector} from "react-redux";
import Topbar from "./Topbar";
import {APIProvider, Map, Marker} from "@vis.gl/react-google-maps";
import {useNavigate} from "react-router-dom";

function CreateEvent() {

    const latitude = useSelector(state => state.auth.latitude);
    const user = useSelector(state => state.auth.user);
    const longitude = useSelector(state => state.auth.longitude);
    const googleApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const navigate = useNavigate();
    let curToken = localStorage.getItem('token');

    const [eventLatitude, setEventLatitude] = useState(latitude);
    const [eventLongitude, setEventLongitude] = useState(longitude);

    const [newEventForm, setNewEventForm] = useState({
        token: curToken,
        user_id: '',
        name: '',
        location: '',
        description: '',
        latitude: '',
        longitude: '',
        event_date: '',
        event_time: '',
    });

    const dispatch = useDispatch();

    const handleInput = (e) => {
        setNewEventForm({...newEventForm, [e.target.name]: e.target.value});
    }

    const goToMainPage = () => {
        navigate('/')
    }

    const submitNewEvent = (e) => {
        e.preventDefault();

        const data = {
            token: curToken,
            user_id: user.id,
            name: newEventForm.name,
            location: newEventForm.location,
            description: newEventForm.description,
            latitude: eventLatitude,
            longitude: eventLongitude,
            event_date: newEventForm.event_date,
            event_time: newEventForm.event_time,
        }

        console.log(data)

        axios.post('/api/create_event', data).then(res => {
            console.log(res)
            if(res && res.data && res.data.success) {
                navigate('/')
            } else {
                dispatch(setToken(null))
                localStorage.removeItem('token')
                window.location.reload();
            }
        })
    }

    const openLoginForm = () => {
        dispatch(setIsRegisterOpen(false))
    }

    const markerDragged = (drag) => {
        setEventLatitude(drag.lat())
        setEventLongitude(drag.lng())
    }

    return (
        <div className="w-full" style={{height: "100svh"}}>
            <div className="w-full h-full bg-blue-300 relative">
                <Topbar className="z-50" style={{zIndex: 50}}/>
                <div className="flex flex-wrap h-full relative" style={{height: "calc(100vh - 40px)"}}>
                    <div className="w-full md:w-1/4 md:h-full bg-white content-center z-50">
                        <div className="w-full my-4 md:pb-8">
                            <div className="px-4">
                                <div className="font-bold text-2xl mb-2">Yeni Etkinlik</div>
                                <div>
                                    <form onSubmit={submitNewEvent}>
                                        <div className="form-group mb-3">
                                            <label>Etkinlik Adı</label>
                                            <input type="" name="name" onChange={handleInput}
                                                   value={newEventForm.name}
                                                   className="form-control"/>
                                        </div>
                                        <div className="form-group mb-3">
                                            <label>Yer</label>
                                            <input type="" name="location" onChange={handleInput}
                                                   value={newEventForm.location}
                                                   className="form-control"/>
                                        </div>
                                        <div className="form-group mb-3">
                                            <label>Açıklama</label>
                                            <input type="" name="description" onChange={handleInput}
                                                   value={newEventForm.description}
                                                   className="form-control"/>
                                        </div>
                                        <div className="form-group mb-3">
                                            <label>Etkinlik Tarihi</label>
                                            <input type="date" name="event_date" onChange={handleInput}
                                                   value={newEventForm.event_date}
                                                   className="form-control"/>
                                        </div>
                                        <div className="form-group mb-3">
                                            <label>Etkinlik Saati</label>
                                            <input type="time" name="event_time" onChange={handleInput}
                                                   value={newEventForm.event_time}
                                                   className="form-control"/>
                                        </div>
                                        <div className="form-group mb-3">
                                            <button type="submit" className="btn btn-primary w-full">Oluştur
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div
                                className="w-full flex justify-content-center items-center font-bold text-blue-600 cursor-pointer"
                                onClick={goToMainPage}>İptal
                            </div>
                        </div>
                    </div>
                    <div
                        className={"w-full md:w-3/4 h-full z-0"}
                        style={{zIndex: 0}}>
                        <APIProvider apiKey={googleApiKey} style={{zIndex: 2}}>

                            <Map
                                defaultZoom={11}
                                disableDefaultUI
                                defaultCenter={{lat: latitude, lng: longitude}}
                                options={{streetViewControl: false}}
                                gestureHandling={'greedy'}
                            >
                                <Marker
                                    position={{ lat: parseFloat(eventLatitude), lng: parseFloat(eventLongitude) }}
                                    onClick={() => console.log('marker was clicked!')}
                                    draggable={true}
                                    onDragEnd={(drag) => markerDragged(drag.latLng)}
                                />
                            </Map>

                        </APIProvider>
                    </div>
                </div>
            </div>
        </div>
    )
        ;
}

export default CreateEvent;