import React, { FC } from 'react';
import {
  BrowserRouter as Router, Routes, Route
} from "react-router-dom"
import './App.css';
import NavBar from './components/NavBar';
import UserCreds from './components/UserCreds';
import HomePage from './pages/HomePage';
import Landing from './pages/Landing';
import LoginSeller from './pages/LoginSeller';
import ProductPage from './pages/ProductPage';
import RegisterClient from './pages/RegisterClient';
import RegisterSeller from './pages/RegisterSeller';
import Test from './pages/Test';
import { useAppSelector } from './typed.hooks/hooks';

const App: FC = () => {

  const { user } = useAppSelector(state => state.auth)

  return (
    <Router>
      <div className="App">
        <NavBar userProp={user} />
        <Routes>
          <Route path="/register/vendor" element={<RegisterSeller />} />
          <Route path="/register/client" element={<RegisterClient />} />
          <Route path="/login/vendor" element={<LoginSeller />} />
          <Route path="/login/client" element={<LoginSeller />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/test" element={<Test />} />
          <Route path="/product/:id" element={<ProductPage cart={false} />} />
          <Route path="/cart/page" element={<ProductPage cart={true} />} />
          <Route path="/" element={<Landing />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
