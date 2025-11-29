import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import Title from "../../components/owner/Title";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const ManageCars = () => {
  const { isOwner, axios, currency } = useAppContext();
  const [cars, setCars] = useState([]);

  const API_BASE = import.meta.env.VITE_API_URL;

  // Fetch all cars of this owner
  const fetchOwnersCars = async () => {
    try {
      const { data } = await axios.get("/api/owner/cars");
      if (data.success) {
        setCars(data.cars);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Update car availability
  const toggleAvailability = async (carId) => {
    try {
      const { data } = await axios.put("/api/owner/toggle-cars", { carId });
      if (data.success) {
        toast.success(data.message);
        fetchOwnersCars();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Delete car
 const deleteCar = async (carId) => {
  try {
    const confirmDelete = window.confirm("Remove this car from your ownership?");
    if (!confirmDelete) return;

    const { data } = await axios.post("/api/owner/remove-car", { carId });

    if (data.success) {
      toast.success(data.message);
      fetchOwnersCars();
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
};


  useEffect(() => {
    if (isOwner) fetchOwnersCars();
  }, [isOwner]);

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
                    src={car.image}
                    alt=""
                    className="h-12 w-12 rounded-md object-cover"
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
                    alt="toggle availability"
                    className="cursor-pointer"
                    onClick={() => toggleAvailability(car.car_id)} // ✅ FIX 3
                  />

                  <img
                    src={assets.delete_icon}
                    alt="delete"
                    className="cursor-pointer"
                    onClick={() => deleteCar(car.car_id)} // ✅ FIX 3
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
