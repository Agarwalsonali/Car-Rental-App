import React, { useState } from "react";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function AddCar(){
  const [license_plate, setLP] = useState("");
  const [Model, setModel] = useState("");
  const [Type, setType] = useState("");
  const [status, setStatus] = useState("available");
  const nav = useNavigate();

  async function submit(e){
    e.preventDefault();
    try {
      await API.post("/cars", { license_plate, Model, Type, status });
      nav("/cars");
    } catch (err) {
      alert(err?.response?.data?.error || "Failed to add car");
    }
  }

  return (
    <div className="max-w-md bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Add Car</h2>
      <form onSubmit={submit} className="space-y-3">
        <input value={license_plate} onChange={e=>setLP(e.target.value)} placeholder="License plate" className="w-full p-2 border rounded" />
        <input value={Model} onChange={e=>setModel(e.target.value)} placeholder="Model" className="w-full p-2 border rounded" />
        <input value={Type} onChange={e=>setType(e.target.value)} placeholder="Type" className="w-full p-2 border rounded" />
        <select value={status} onChange={e=>setStatus(e.target.value)} className="w-full p-2 border rounded">
          <option value="available">Available</option>
          <option value="rented">Rented</option>
          <option value="maintenance">Maintenance</option>
        </select>
        <button className="w-full bg-blue-600 text-white p-2 rounded">Add Car</button>
      </form>
    </div>
  );
}
