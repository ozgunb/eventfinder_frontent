import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setIsEventDetailOpen, setSelectedEvent} from "../../redux/features/auth/authSlice";
import moment from "moment/moment";

function EventDetail() {

    const dispatch = useDispatch();
    const selectedEvent = useSelector(state => state.auth.selectedEvent);

    const closeEventDetail = () => {
        dispatch(setIsEventDetailOpen(false))
    }

    return (
        <div className="w-full h-full">
            <div className="border-bottom p-2">
                <div className="flex justify-content-between">
                    <div className="font-bold">{selectedEvent.name}</div>
                    <div className="cursor-pointer" onClick={closeEventDetail}>Kapat</div>
                </div>
                <div className="text-sm text-gray-400">
                    {selectedEvent.location}
                </div>
            </div>
            <div className="w-full p-2">
                <div className="text-gray-400">Adres</div>
                <div> {selectedEvent.location}</div>
            </div>
            <div className="w-full p-2">
                <div className="text-gray-400">Tarih</div>
                <div> {moment(selectedEvent.event_date, "YYYY-MM-DD").format("DD.MM.YYYY")}</div>
            </div>
            <div className="w-full p-2">
                <div className="text-gray-400">Saat</div>
                <div> {moment(selectedEvent.event_time, "HH:mm:ss").format("HH:mm")}</div>
            </div>

        </div>
    );
}

export default EventDetail;