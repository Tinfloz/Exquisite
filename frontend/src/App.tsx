import React, { FC } from 'react';
import {
  BrowserRouter as Router, Routes, Route
} from "react-router-dom"
import './App.css';
import NavBar from './components/NavBar';
import UserCreds from './components/UserCreds';
import ChangeDetails from './pages/ChangeDetails';
import ChangePassword from './pages/ChangePassword';
import CheckoutPage from './pages/CheckoutPage';
import CreateProduct from './pages/CreateProduct';
import GetDeliveries from './pages/GetDeliveries';
import HomePage from './pages/HomePage';
import Landing from './pages/Landing';
import LoginSeller from './pages/LoginSeller';
import MarkDelivered from './pages/MarkDelivered';
import MyOrders from './pages/MyOrders';
import MyProducts from './pages/MyProducts';
import ProductPage from './pages/ProductPage';
import RegisterClient from './pages/RegisterClient';
import RegisterSeller from './pages/RegisterSeller';
import ResetPasswordLink from './pages/ResetPasswordLink';
import SetAddress from './pages/SetAddress';
import Test from './pages/Test';
import TopProducts from './pages/TopProducts';
import UpdateStock from './pages/UpdateStock';
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
          <Route path="/checkout/:productId/:qty" element={<CheckoutPage cart={false} />} />
          <Route path="/checkout" element={<CheckoutPage cart={true} />} />
          <Route path="/create/product" element={<CreateProduct />} />
          <Route path="/my/products" element={<MyProducts />} />
          <Route path="/my/orders" element={<GetDeliveries />} />
          <Route path="/mark/delivered/:productId/:orderId" element={<MarkDelivered />} />
          <Route path="/top/products" element={<TopProducts />} />
          <Route path="/set/address/vendor" element={<SetAddress seller={true} />} />
          <Route path="/set/address/client" element={<SetAddress seller={false} />} />
          <Route path="/get/all/orders" element={<MyOrders />} />
          <Route path="/update/stock/:productId" element={<UpdateStock />} />
          <Route path="/change/details/user" element={<ChangeDetails />} />
          <Route path="/get/reset/link" element={<ResetPasswordLink />} />
          <Route path="/reset/password/:token" element={<ChangePassword />} />
          <Route path="/" element={<Landing />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
