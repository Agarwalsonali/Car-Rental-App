import { Link, useLocation, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAppContext } from "../context/AppContext";

export default function Navbar() {

  const {setShowLogin, user, logout, isOwner, axios, setIsOwner} = useAppContext()

  const location = useLocation();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  
  const changeRole = async ()=>{
    try{
      const {data} = await axios.post('/api/owner/change-role')
      if(data.success){
        setIsOwner(true)
        toast.success(data.message)
      }else{
        toast.error(data.message)
      }
    } catch(error){
      toast.error(error.message)
    }
  }

  return (
    <div
      className={`px-6 flex justify-between items-center md:px-16 lg:px-24 xl:px-32 py-4 text-gray-600 border-b border-borderColor relative transition-all ${
        location.pathname === "/" && "bg-light"
      }`}
    >
      {/* Brand */}
      <Link
        to="/"
        className="text-2xl font-bold from-blue-600 to-indigo-500 text-transparent bg-clip-text"
      >
        <img src={assets.logo} alt="logo" className="h-8" />
      </Link>

      {/* Links */}
      <div
        className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:border-t border-borderColor right-0 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4 transition-all duration-300 z-50 ${
          location.pathname === "/" ? "bg-light" : "bg-white"
        } ${open ? "max-sm:right-0" : "max-sm:-right-full"}`}
      >
        <Link to="/" className="hover:text-primary font-medium">
          Home
        </Link>
        <Link to="/cars" className="hover:text-primary font-medium">
          Cars
        </Link>
        {isLoggedIn && (
          <Link to="/bookings" className="hover:text-primary font-medium">
            My Bookings
          </Link>
        )}

        {/* Search bar */}
        <div className="hidden lg:flex items-center text-sm gap-2 border border-borderColor px-3 rounded-full max-w-56">
          <input
            type="text"
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            placeholder="Search products"
          />
          <img src={assets.search_icon} alt="search" />
        </div>

        {/* Right buttons */}
        <div className="flex max-sm:flex-col items-start sm:items-center gap-6">
            <>
              <button
                onClick={() => isOwner ? nav("/owner") : changeRole()}
                className="cursor-pointer hover:text-primary font-medium"
              >
                {isOwner ? 'Dashboard' : 'List cars'}
              </button>

              <button
                onClick={()=> {user ? logout() : setShowLogin(true)}}
                className="cursor-pointer px-8 py-2 bg-red-500 hover:bg-red-600 transition-all text-white rounded-lg"
              >
                {user ? 'Logout' : 'Login'}
              </button>
            </>
        </div>
      </div>

      {/* Mobile menu */}
      <button
        className="sm:hidden cursor-pointer"
        aria-label="Menu"
        onClick={() => setOpen(!open)}
      >
        <img
          src={open ? assets.close_icon : assets.menu_icon}
          alt="menu"
          className="w-6 h-6"
        />
      </button>
    </div>
  );
}
