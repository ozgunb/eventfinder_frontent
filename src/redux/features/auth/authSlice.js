import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    token: null,
    isRegisterOpen: false,
    isEventDetailOpen: false,
    latitude: null,
    longitude: null,
    zoom: 11,
    events: [],
    selectedEvent: null,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        removeUser: (state) => {
            state.user = null
        },
        removeToken: (state) => {
            state.token = null
        },
        setUser: (state, action) => {
            state.user = action.payload
        },
        setToken: (state, action) => {
            state.token = action.payload
        },
        setIsRegisterOpen: (state, action) => {
            state.isRegisterOpen = action.payload
        },
        setIsEventDetailOpen: (state, action) => {
            state.isEventDetailOpen = action.payload
        },
        setLatitude: (state, action) => {
            state.latitude = action.payload
        },
        setLongitude: (state, action) => {
            state.longitude = action.payload
        },
        setZoom: (state, action) => {
            state.zoom = action.payload
        },
        setEvents: (state, action) => {
            state.events = action.payload
        },
        setSelectedEvent: (state, action) => {
            state.selectedEvent = action.payload
        },
    }
})

export const { removeUser, removeToken, setUser, setToken, setIsRegisterOpen, setLatitude, setLongitude, setEvents, setIsEventDetailOpen, setSelectedEvent, setZoom} = authSlice.actions

export default  authSlice.reducer