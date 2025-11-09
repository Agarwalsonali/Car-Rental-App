// src/pages/Payments/Payments.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/api";

export default function Payments(){
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    Booking_id: "",
    Payment_date: "",
    Payment_method: "card",
    Amount: ""
  });

  useEffect(()=>{
    (async ()=>{
      try {
        const res = await API.get("/payments");
        setPayments(res.data);
      } catch (err) {
        console.error("Failed to load payments", err);
        alert("Failed to load payments");
      } finally { setLoading(false); }
    })();
  },[]);

  async function submit(e){
    e.preventDefault();
    try {
      const res = await API.post("/payments", form);
      setPayments(prev => [res.data, ...prev]);
      setForm({ Booking_id: "", Payment_date: "", Payment_method: "card", Amount: "" });
    } catch (err) {
      console.error("Add payment failed", err);
      alert(err?.response?.data?.error || "Payment failed");
    }
  }

  if (loading) return <div>Loading payments...</div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Payments</h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {payments.map(p => (
          <div key={p.Payment_id} className="bg-white p-3 rounded shadow">
            <div className="font-semibold">Payment #{p.Payment_id}</div>
            <div>Booking: {p.Booking_id}</div>
            <div>Date: {p.Payment_date}</div>
            <div>Method: {p.Payment_method}</div>
            <div>Amount: {p.Amount}</div>
          </div>
        ))}
      </div>

      <div className="max-w-md bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">Add Payment</h2>
        <form onSubmit={submit} className="space-y-2">
          <input value={form.Booking_id} onChange={e=>setForm({...form, Booking_id: e.target.value})} placeholder="Booking_id" className="w-full p-2 border rounded" />
          <input type="date" value={form.Payment_date} onChange={e=>setForm({...form, Payment_date: e.target.value})} className="w-full p-2 border rounded" />
          <select value={form.Payment_method} onChange={e=>setForm({...form, Payment_method: e.target.value})} className="w-full p-2 border rounded">
            <option value="card">Card</option>
            <option value="cash">Cash</option>
          </select>
          <input value={form.Amount} onChange={e=>setForm({...form, Amount: e.target.value})} placeholder="Amount" className="w-full p-2 border rounded" />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Add Payment</button>
        </form>
      </div>
    </div>
  );
}
