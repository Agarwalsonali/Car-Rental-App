import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Cars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token"); // Get saved JWT from login

    axios
      .get("http://localhost:8080/api/cars", {
        headers: {
          Authorization: token, // Attach token here
        },
      })
      .then((res) => {
        setCars(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response?.data?.message === "No token provided") {
          setError("Please log in again — token missing or expired.");
        } else {
          setError("Failed to fetch cars");
        }
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-10">Loading cars...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-8">
        🚗 Available Cars
      </h1>
      {cars.length === 0 ? (
        <p className="text-center text-gray-500">No cars available yet.</p>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {cars.map((car) => (
            <div
              key={car.car_id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold text-gray-800">
                  {car.model_name}
                </h2>
                <span
                  className={`px-3 py-1 text-sm rounded-full ${
                    car.status === "available"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {car.status}
                </span>
              </div>
              <p className="text-gray-600 text-sm">
                <strong>Type:</strong> {car.type_name}
              </p>
              <p className="text-gray-600 text-sm">
                <strong>License:</strong> {car.license_plate}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
