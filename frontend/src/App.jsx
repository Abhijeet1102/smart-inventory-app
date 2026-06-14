import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

import ManageUsers from './pages/ManageUsers';
import ManageCategories from './pages/ManageCategories';
import ManageProducts from './pages/ManageProducts';
import ManageCustomers from './pages/ManageCustomers';
import ManageOrders from './pages/ManageOrders';
import ViewOrders from './pages/ViewOrders';
import Profile from './pages/Profile';
import Payments from './pages/Payments';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="categories" element={<ManageCategories />} />
          <Route path="products" element={<ManageProducts />} />
          <Route path="customers" element={<ManageCustomers />} />
          <Route path="orders" element={<ManageOrders />} />
          <Route path="view-orders" element={<ViewOrders />} />
          <Route path="profile" element={<Profile />} />
          <Route path="payments" element={<Payments />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
