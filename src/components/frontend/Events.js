import React, {useEffect, useState} from "react";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {
    setIsRegisterOpen,
    setLatitude,
    setLongitude,
    setToken,
    setUser,
    setEvents,
    setIsEventDetailOpen, setSelectedEvent
} from "../../redux/features/auth/authSlice";
import moment from 'moment';
import {useNavigate} from "react-router-dom";

function Events() {

    const curState = useSelector(state => state);
    const events = useSelector(state => state.auth.events);
    const latitude = useSelector(state => state.auth.latitude);
    const longitude = useSelector(state => state.auth.longitude);
    //const token = useSelector(state => state.token);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchKey, setSearchKey] = useState('');

    const [lastZoom, setLastZoom] = useState(11);

    const openEventDetail = (prmEvent) => {
        console.log("event")
        console.log(JSON.stringify(prmEvent))
        dispatch(setSelectedEvent(prmEvent))
        dispatch(setIsEventDetailOpen(true))
    }

    const refreshEvents = (prmEvent) => {
        console.log("refresh")
        let curToken = localStorage.getItem('token');
        const data = {
            token: curToken,
            latitude: latitude,
            longitude: longitude,
            distance: lastZoom,
        }
        axios.post('/api/get_nearest_events', data).then(res => {
            console.log(res)
            if(res && res.data && res.data.success) {
                dispatch(setEvents(res.data.events))
            } else {
                dispatch(setToken(null))
                localStorage.removeItem('token')
                window.location.reload();
            }
        })
    }

    useEffect( () => {
        refreshEvents();
    }, []);

    useEffect( () => {
        console.log("compare : " + lastZoom + " --- " + curState.auth.zoom)
        if(lastZoom !== curState.auth.zoom) {
            console.log("--------------zoom changed")
            setLastZoom(curState.auth.zoom)
            refreshEvents();
        }
    }, [curState]);

    const openNewEventForm = () => {
        navigate('/create_event')
    }

    const searchSubmit = (e) => {
        e.preventDefault();
        console.log("submit search")
        let curToken = localStorage.getItem('token');
        const data = {
            token: curToken,
            key: searchKey,
        }
        axios.post('/api/get_search_events', data).then(res => {
            console.log(res)
            if(res && res.data && res.data.success) {
                dispatch(setEvents(res.data.events))
            } else {
                dispatch(setToken(null))
                localStorage.removeItem('token')
                window.location.reload();
            }
        })
    }

    const handleInput = (e) => {
        setSearchKey(e.target.value)
    }

    return (
        <div className="w-full h-full my-2 md:pb-8 border-end">
            <div className="w-full flex p-1">
                <form onSubmit={searchSubmit} className="w-full">
                    <input type="text" name="search" onChange={handleInput} value={searchKey} className="form-control"
                           placeholder="Tüm etkinlinkler"/>
                </form>
                <div className="btn btn-info font-bold text-white ml-2" onClick={openNewEventForm}>+</div>
            </div>
            <div className="w-full">
                {events.map(event =>
                    <div className="w-full flex justify-content-between px-2 py-2 border-bottom cursor-pointer hover:bg-blue-200" onClick={() => openEventDetail(event)}>
                        <div className="w-full flex flex-wrap px-2">
                            <div className="w-full font-bold text-sm">
                                {event.name}
                            </div>
                            <div className="w-full text-xs text-gray-400">
                                {event.location}
                            </div>
                        </div>
                        <div className="flex flex-wrap text-xs">
                            <div className="w-full text-end">
                                {moment(event.event_time, "HH:mm:ss").format("HH:mm")}
                            </div>
                            <div className="w-full text-end text-xs">
                                {moment(event.event_date, "YYYY-MM-DD").format("DD.MM.YYYY")}
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
}

export default Events;