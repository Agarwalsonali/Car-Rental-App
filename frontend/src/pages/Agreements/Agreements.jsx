// src/pages/Agreements/Agreements.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/api";

export default function Agreements(){
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    Booking_id: "",
    Terms_text: "",
    Apply_date: "",
    Terminate_date: ""
  });

  useEffect(()=>{
    (async ()=>{
      try {
        const res = await API.get("/agreements");
        setAgreements(res.data);
      } catch (err) {
        console.error("Failed to load agreements", err);
      } finally { setLoading(false); }
    })();
  },[]);

  async function submit(e){
    e.preventDefault();
    try {
      const res = await API.post("/agreements", form);
      setAgreements(prev => [res.data, ...prev]);
      setForm({ Booking_id: "", Terms_text: "", Apply_date: "", Terminate_date: "" });
    } catch (err) {
      console.error("Add agreement failed", err);
      alert(err?.response?.data?.error || "Failed");
    }
  }

  if (loading) return <div>Loading agreements...</div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Agreements</h1>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {agreements.map(a => (
          <div key={a.Agreement_id} className="bg-white p-4 rounded shadow">
            <div className="font-semibold">Agreement #{a.Agreement_id}</div>
            <div className="text-sm">Booking: {a.Booking_id}</div>
            <div className="text-sm">Apply: {a.Apply_date} • Terminate: {a.Terminate_date}</div>
            <div className="mt-2 text-sm">{a.Terms_text}</div>
          </div>
        ))}
      </div>

      <div className="max-w-xl bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">Add Agreement</h2>
        <form onSubmit={submit} className="space-y-2">
          <input value={form.Booking_id} onChange={e=>setForm({...form, Booking_id: e.target.value})} placeholder="Booking_id" className="w-full p-2 border rounded" />
          <textarea value={form.Terms_text} onChange={e=>setForm({...form, Terms_text: e.target.value})} placeholder="Terms" className="w-full p-2 border rounded" rows={4}/>
          <div className="grid grid-cols-2 gap-2">
            <input type="date" value={form.Apply_date} onChange={e=>setForm({...form, Apply_date: e.target.value})} className="p-2 border rounded" />
            <input type="date" value={form.Terminate_date} onChange={e=>setForm({...form, Terminate_date: e.target.value})} className="p-2 border rounded" />
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Add Agreement</button>
        </form>
      </div>
    </div>
  );
}
