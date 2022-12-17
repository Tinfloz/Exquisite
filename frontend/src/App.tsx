import React, { FC } from 'react';
import {
  BrowserRouter as Router, Routes, Route
} from "react-router-dom"
import './App.css';
import NavBar from './components/NavBar';
import UserCreds from './components/UserCreds';
import Landing from './pages/Landing';
import LoginSeller from './pages/LoginSeller';
import RegisterClient from './pages/RegisterClient';
import RegisterSeller from './pages/RegisterSeller';

const App: FC = () => {
  return (
    <Router>
      <div className="App">
        <NavBar sendUser={null} />
        <Routes>
          <Route path="/register/vendor" element={<RegisterSeller />} />
          <Route path="/register/client" element={<RegisterClient />} />
          <Route path="/login/vendor" element={<LoginSeller />} />
          <Route path="/login/client" element={<LoginSeller />} />
          <Route path="/" element={<Landing />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
