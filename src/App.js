import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

import Home from "./components/frontend/Home";
import CreateEvent from "./components/frontend/CreateEvent";
import Login from "./components/frontend/auth/Login";
import Register from "./components/frontend/auth/Register";
import axios from "axios";

axios.defaults.baseURL = "http://127.0.0.1:8000/";
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.post['Accept'] = 'application/json';
axios.defaults.withCredentials = true;

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
            <Route exact path="/" element={ <Home /> } />
            <Route exact path="/create_event" element={ <CreateEvent /> } />
          {/*<Route path="/login" element={ <Login /> } />*/}
          {/*<Route path="/register" element={ <Register /> } />*/}

        </Routes>
      </Router>
    </div>
  );
}

export default App;
