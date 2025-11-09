// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalCars: 0,
    availableCars: 0,
    totalBookings: 0,
    activeBookings: 0,
    totalPayments: 0,
    totalCustomers: 0,
  });
  const [loading, setLoading] = useState(true);

  // Fetch summary data
  useEffect(() => {
    (async () => {
      try {
        const res = await API.get("/dashboard/summary"); 
        // expected backend response: 
        // { totalCars, availableCars, totalBookings, activeBookings, totalPayments, totalCustomers }
        setStats(res.data);
      } catch (err) {
        console.error("Dashboard fetch failed", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="text-center text-gray-600">Loading dashboard...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-100 p-6 rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-blue-800">Total Cars</h2>
          <p className="text-3xl font-bold mt-2">{stats.totalCars}</p>
          <Link to="/cars" className="text-sm text-blue-600 underline mt-3 inline-block">View Cars</Link>
        </div>

        <div className="bg-green-100 p-6 rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-green-800">Available Cars</h2>
          <p className="text-3xl font-bold mt-2">{stats.availableCars}</p>
        </div>

        <div className="bg-yellow-100 p-6 rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-yellow-800">Total Bookings</h2>
          <p className="text-3xl font-bold mt-2">{stats.totalBookings}</p>
          <Link to="/bookings" className="text-sm text-yellow-700 underline mt-3 inline-block">View Bookings</Link>
        </div>

        <div className="bg-orange-100 p-6 rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-orange-800">Active Bookings</h2>
          <p className="text-3xl font-bold mt-2">{stats.activeBookings}</p>
        </div>

        <div className="bg-purple-100 p-6 rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-purple-800">Payments (₹)</h2>
          <p className="text-3xl font-bold mt-2">{stats.totalPayments}</p>
          <Link to="/payments" className="text-sm text-purple-700 underline mt-3 inline-block">View Payments</Link>
        </div>

        <div className="bg-pink-100 p-6 rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-pink-800">Total Customers</h2>
          <p className="text-3xl font-bold mt-2">{stats.totalCustomers}</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link to="/cars/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add New Car</Link>
          <Link to="/bookings" className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">View Bookings</Link>
          <Link to="/payments" className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">Manage Payments</Link>
          <Link to="/locations" className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600">View Locations</Link>
          <Link to="/agreements" className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">Agreements</Link>
        </div>
      </div>
    </div>
  );
}
