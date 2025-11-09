import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    fname: "",
    mname: "",
    lname: "",
    email: "",
    password: ""
  });
  const { register } = useContext(AuthContext);
  const nav = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      nav("/dashboard");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create Your Account 🚗
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <input
              name="fname"
              placeholder="First Name"
              value={form.fname}
              onChange={handleChange}
              className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-primary"
            />
            <input
              name="mname"
              placeholder="Middle Name"
              value={form.mname}
              onChange={handleChange}
              className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-primary"
            />
            <input
              name="lname"
              placeholder="Last Name"
              value={form.lname}
              onChange={handleChange}
              className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>
          <input
            name="email"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-primary"
          />
          <input
            name="password"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
