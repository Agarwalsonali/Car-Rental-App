import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
//import CarsList from "./pages/Cars/CarsList";
import AddCar from "./pages/Cars/AddCar";
import EditCar from "./pages/Cars/EditCar";
import Bookings from "./pages/Bookings/Bookings";
import Payments from "./pages/Payments/Payments";
import Locations from "./pages/Locations/Locations";
import Agreements from "./pages/Agreements/Agreements";
import PrivateRoute from "./components/PrivateRoute";
import Cars from "./pages/Cars";

export default function App(){
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto p-6">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<PrivateRoute><Dashboard/></PrivateRoute>} />
          {/* <Route path="/cars" element={<PrivateRoute><CarsList/></PrivateRoute>} /> */}
          <Route path="/cars" element={<PrivateRoute><Cars/></PrivateRoute>} />
          <Route path="/cars/new" element={<PrivateRoute><AddCar/></PrivateRoute>} />
          <Route path="/cars/:id/edit" element={<PrivateRoute><EditCar/></PrivateRoute>} />
          <Route path="/bookings" element={<PrivateRoute><Bookings/></PrivateRoute>} />
          <Route path="/payments" element={<PrivateRoute><Payments/></PrivateRoute>} />
          <Route path="/locations" element={<PrivateRoute><Locations/></PrivateRoute>} />
          <Route path="/agreements" element={<PrivateRoute><Agreements/></PrivateRoute>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}
