import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { useParams, useNavigate } from "react-router-dom";

export default function EditCar(){
  const { id } = useParams();
  const nav = useNavigate();
  const [car, setCar] = useState(null);

  useEffect(()=>{
    (async ()=>{
      const res = await API.get(`/cars/${id}`); // you should add this endpoint to backend
      setCar(res.data);
    })();
  },[id]);

  async function submit(e){
    e.preventDefault();
    try {
      await API.put(`/cars/${id}`, car);
      nav("/cars");
    } catch (err) {
      alert("Update failed");
    }
  }

  if (!car) return <div>Loading...</div>;
  return (
    <form onSubmit={submit} className="max-w-md bg-white p-6 rounded shadow">
      <h2 className="text-xl mb-4">Edit Car</h2>
      <input value={car.license_plate} onChange={e=>setCar({...car, license_plate: e.target.value})} className="w-full p-2 border rounded" />
      <input value={car.model_name} onChange={e=>setCar({...car, model_name: e.target.value})} className="w-full mt-2 p-2 border rounded" />
      <input value={car.type_name} onChange={e=>setCar({...car, type_name: e.target.value})} className="w-full mt-2 p-2 border rounded" />
      <select value={car.status} onChange={e=>setCar({...car, status: e.target.value})} className="w-full mt-2 p-2 border rounded">
        <option value="available">Available</option>
        <option value="rented">Rented</option>
        <option value="maintenance">Maintenance</option>
      </select>
      <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded">Save</button>
    </form>
  );
}
