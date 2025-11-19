import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useState } from "react";
import Home from "./pages/Home";
import CarDetails from "./pages/CarDetails";
import Footer from "./components/Footer";
import Cars from "./pages/Cars";
import MyBookings from "./pages/MyBookings";
import Layout from "./pages/owner/Layout";
import Dashboard from "./pages/owner/Dashboard";
import AddCar from "./pages/owner/AddCar";
import ManageCars from "./pages/owner/ManageCars";
import ManageBookings from "./pages/owner/ManageBookings";
import Login from "./components/Login";
import { ToastContainer  } from "react-toastify";
import { useAppContext } from "./context/AppContext";

export default function App(){

  const { showLogin } = useAppContext()
  const isOwnerPath = useLocation().pathname.startsWith('/owner')

  return (
    <div className="min-h-screen">
      < ToastContainer />
      
      {showLogin && <Login />}
      
      {!isOwnerPath && <Navbar />}            {/*Navbar will not be shown on owner dashboard */}
      <main className="container mx-auto p-6">
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/car-details/:id" element={<CarDetails/>}/>
          <Route path="/cars" element={<Cars/>}/>
          <Route path="/bookings" element={<MyBookings/>}/>
          <Route path="/owner" element={<Layout />} >
            <Route index element={<Dashboard />} />
            <Route path="add-car" element={<AddCar />} />
            <Route path="manage-cars" element={<ManageCars />} />
            <Route path="manage-bookings" element={<ManageBookings />} />
          </Route>
        </Routes>

         { !isOwnerPath && <Footer />}
      </main>
     
    </div>
  );
}
