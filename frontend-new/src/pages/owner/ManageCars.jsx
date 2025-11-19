import React, { useEffect, useState } from "react";
import axios from "axios";
import { assets } from "../../assets/assets";
import Title from "../../components/owner/Title";

const ManageCars = () => {
  const [cars, setCars] = useState([]);
  const currency = import.meta.env.VITE_CURRENCY || "$";

  // backend base url
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  // get ownerId from localStorage (assuming user is logged in)
  const ownerId = localStorage.getItem("owner_id");

  // Fetch all cars of this owner
  const fetchOwnersCars = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/cars/owner/${ownerId}`);
      setCars(res.data);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  // Update car availability
  const toggleAvailability = async (carId, currentStatus) => {
    try {
      const res = await axios.put(`${API_BASE}/api/cars/${carId}/status`, {
        status: !currentStatus,
      });

      setCars((prev) =>
        prev.map((c) =>
          c.car_id === carId ? { ...c, is_available: !currentStatus } : c
        )
      );
    } catch (error) {
      console.error("Error updating car status:", error);
    }
  };

  // Delete car
  const deleteCar = async (carId) => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;

    try {
      await axios.delete(`${API_BASE}/api/cars/${carId}`);
      setCars((prev) => prev.filter((c) => c.car_id !== carId));
    } catch (error) {
      console.error("Error deleting car:", error);
    }
  };

  useEffect(() => {
    fetchOwnersCars();
  }, []);

  return (
    <div className="px-4 pt-10 md:px-10 w-full">
      <Title
        title="Manage Cars"
        subTitle="View all listed cars, update their details, or remove them from the platform."
      />

      <div className="max-w-4xl w-full rounded-md overflow-hidden border border-borderColor mt-6">
        <table className="w-full border-collapse text-left text-sm text-gray-600">
          <thead className="text-gray-500">
            <tr>
              <th className="p-3 font-medium">Car</th>
              <th className="p-3 font-medium max-md:hidden">Category</th>
              <th className="p-3 font-medium">Price</th>
              <th className="p-3 font-medium max-md:hidden">Status</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car.car_id} className="border-t border-borderColor">
                <td className="p-3 flex items-center gap-3">
                  <img
                    src={`${API_BASE}/uploads/cars/${car.image}`}
                    alt=""
                    className="h-12 w-12 aspect-square rounded-md object-cover"
                  />
                  <div className="max-md:hidden">
                    <p className="font-medium">
                      {car.brand_name} {car.model_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {car.seating_capacity} Seats - {car.transmission}
                    </p>
                  </div>
                </td>

                <td className="p-3 max-md:hidden">{car.category}</td>
                <td className="p-3">
                  {currency}
                  {car.price_per_day}/day
                </td>

                <td className="p-3 max-md:hidden">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      car.is_available
                        ? "bg-green-100 text-green-500"
                        : "bg-red-100 text-red-500"
                    }`}
                  >
                    {car.is_available ? "Available" : "Unavailable"}
                  </span>
                </td>

                <td className="flex items-center p-3 gap-3">
                  <img
                    src={
                      car.is_available
                        ? assets.eye_close_icon
                        : assets.eye_icon
                    }
                    alt=""
                    className="cursor-pointer"
                    onClick={() =>
                      toggleAvailability(car.car_id, car.is_available)
                    }
                  />
                  <img
                    src={assets.delete_icon}
                    alt=""
                    className="cursor-pointer"
                    onClick={() => deleteCar(car.car_id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCars;
