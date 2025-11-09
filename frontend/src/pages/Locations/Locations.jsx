// src/pages/Locations/Locations.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/api";

export default function Locations(){
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ Location_name: "", Address: "" });

  useEffect(()=>{
    (async ()=>{
      try {
        const res = await API.get("/locations");
        setLocations(res.data);
      } catch (err) {
        console.error("Failed to load locations", err);
      } finally { setLoading(false); }
    })();
  },[]);

  async function submit(e){
    e.preventDefault();
    try {
      const res = await API.post("/locations", form);
      setLocations(prev => [res.data, ...prev]);
      setForm({ Location_name: "", Address: "" });
    } catch (err) {
      console.error("Add location failed", err);
      alert(err?.response?.data?.error || "Failed");
    }
  }

  if (loading) return <div>Loading locations...</div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Locations</h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {locations.map(loc => (
          <div key={loc.Location_id} className="bg-white p-4 rounded shadow">
            <div className="font-semibold">{loc.Location_name}</div>
            <div className="text-sm">{loc.Address}</div>
          </div>
        ))}
      </div>

      <div className="max-w-md bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">Add Location</h2>
        <form onSubmit={submit} className="space-y-2">
          <input value={form.Location_name} onChange={e=>setForm({...form, Location_name: e.target.value})} placeholder="Location name" className="w-full p-2 border rounded" />
          <input value={form.Address} onChange={e=>setForm({...form, Address: e.target.value})} placeholder="Address" className="w-full p-2 border rounded" />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Add Location</button>
        </form>
      </div>
    </div>
  );
}
