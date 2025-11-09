// src/pages/Bookings/Bookings.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/api";

export default function Bookings(){
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    Customer_id: "",
    Car_id: "",
    Start_date: "",
    End_date: "",
    Booking_status: "confirmed",
    Pickup_location_id: "",
    Dropoff_location_id: ""
  });

  useEffect(()=>{
    (async ()=>{
      try {
        const res = await API.get("/bookings");
        setBookings(res.data);
      } catch (err) {
        console.error("Failed to load bookings", err);
        alert("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    })();
  },[]);

  async function submit(e){
    e.preventDefault();
    try {
      const res = await API.post("/bookings", form);
      setBookings(prev => [res.data, ...prev]); // assume backend returns inserted booking
      // reset key fields
      setForm({
        Customer_id: "",
        Car_id: "",
        Start_date: "",
        End_date: "",
        Booking_status: "confirmed",
        Pickup_location_id: "",
        Dropoff_location_id: ""
      });
    } catch (err) {
      console.error("Create booking failed", err);
      alert(err?.response?.data?.error || "Booking failed");
    }
  }

  if (loading) return <div>Loading bookings...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Bookings</h1>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {bookings.map(b => (
          <div key={b.Booking_id} className="bg-white p-4 rounded shadow">
            <div className="font-bold">Booking #{b.Booking_id} — {b.Booking_status}</div>
            <div className="text-sm">Customer: {b.Customer_id}</div>
            <div className="text-sm">Car: {b.Car_id}</div>
            <div className="text-sm">From: {b.Start_date} To: {b.End_date}</div>
            <div className="text-sm">Pickup loc: {b.Pickup_location_id} • Dropoff loc: {b.Dropoff_location_id}</div>
          </div>
        ))}
      </div>

      <div className="max-w-xl bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-3">Create Booking</h2>
        <form onSubmit={submit} className="space-y-2">
          <input className="w-full p-2 border rounded" placeholder="Customer_id" value={form.Customer_id} onChange={e=>setForm({...form, Customer_id: e.target.value})}/>
          <input className="w-full p-2 border rounded" placeholder="Car_id" value={form.Car_id} onChange={e=>setForm({...form, Car_id: e.target.value})}/>
          <div className="grid grid-cols-2 gap-2">
            <input type="date" className="p-2 border rounded" value={form.Start_date} onChange={e=>setForm({...form, Start_date: e.target.value})}/>
            <input type="date" className="p-2 border rounded" value={form.End_date} onChange={e=>setForm({...form, End_date: e.target.value})}/>
          </div>
          <select className="w-full p-2 border rounded" value={form.Booking_status} onChange={e=>setForm({...form, Booking_status: e.target.value})}>
            <option value="confirmed">confirmed</option>
            <option value="completed">completed</option>
            <option value="canceled">canceled</option>
          </select>
          <input className="w-full p-2 border rounded" placeholder="Pickup_location_id" value={form.Pickup_location_id} onChange={e=>setForm({...form, Pickup_location_id: e.target.value})}/>
          <input className="w-full p-2 border rounded" placeholder="Dropoff_location_id" value={form.Dropoff_location_id} onChange={e=>setForm({...form, Dropoff_location_id: e.target.value})}/>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Create Booking</button>
        </form>
      </div>
    </div>
  );
}
