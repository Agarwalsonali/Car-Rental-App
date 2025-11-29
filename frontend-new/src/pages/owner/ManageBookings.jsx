import React, { useEffect, useState } from "react";
import axios from "axios";
import Title from "../../components/owner/Title";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const ManageBookings = () => {

  const { currency, axios} = useAppContext() 

  const [bookings, setBookings] = useState([]);

  // Fetch all bookings for cars owned by this owner
  const fetchOwnerBookings = async () => {
    try {
      const { data } = await axios.get('/api/owner/bookings')
      data.success ? setBookings(data.bookings) : toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  };

  // Update booking status (approve or cancel)
  const changeBookingStatus = async (bookingId, status) => {
    try {
      const { data } = await axios.put('/api/owner/change-status', { bookingId, status })
      if(data.success){
        toast.success(data.message)
        fetchOwnerBookings()
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  };

  useEffect(() => {
    fetchOwnerBookings();
  }, []);

  return (
    <div className="px-4 pt-10 md:px-10 w-full">
      <Title
        title="Manage Bookings"
        subTitle="Track all customer bookings, approve or cancel requests, and manage booking status."
      />

      <div className="max-w-4xl w-full rounded-md overflow-hidden border border-borderColor mt-6">
        <table className="w-full border-collapse text-left text-sm text-gray-600">
          <thead className="text-gray-500">
            <tr>
              <th className="p-3 font-medium">Car</th>
              <th className="p-3 font-medium max-md:hidden">Date Range</th>
              <th className="p-3 font-medium">Total</th>
              <th className="p-3 font-medium max-md:hidden">Payment</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr
                key={booking.booking_id}
                className="border-t border-borderColor text-gray-500"
              >
                <td className="p-3 flex items-center gap-3">
                  <img 
                    src={booking.image}
                    alt=""
                    className="h-12 w-12 aspect-square rounded-md object-cover"
                  />
                  <p className="font-medium max-md:hidden">
                    {booking.brand_name} {booking.model_name}

                  </p>
                </td>

                <td className="p-3 max-md:hidden">
                  {booking.pickup_date.split("T")[0]} to{" "}
                  {booking.return_date.split("T")[0]}
                </td>

                <td className="p-3">
                  {currency}
                  {booking.price}
                </td>

                <td className="p-3 max-md:hidden">
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-xs">
                    {booking.payment_method || "offline"}
                  </span>
                </td>

                <td className="p-3">
                  {booking.status === "pending" ? (
                    <select
                      value={booking.status}
                      onChange={(e) =>
                        changeBookingStatus(booking.booking_id, e.target.value)
                      }
                      className="px-2 py-1.5 mt-1 text-gray-500 border border-borderColor rounded-md outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="confirmed">Confirmed</option>
                    </select>
                  ) : (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.status === "confirmed"
                          ? "bg-green-100 text-green-500"
                          : "bg-red-100 text-red-500"
                      }`}
                    >
                      {booking.status}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageBookings;
