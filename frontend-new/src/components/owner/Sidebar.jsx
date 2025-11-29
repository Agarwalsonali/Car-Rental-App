import React, { useState } from 'react'
import { assets, ownerMenuLinks } from '../../assets/assets'
import { NavLink, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';

const Sidebar = () => {

  const { user, axios, fetchUser, setUser } = useAppContext();
  const location = useLocation();
  const [image, setImage] = useState('');

  const updateImage = async () => {
    try {
      const formData = new FormData();
      formData.append('image', image);

      const { data } = await axios.post('/api/owner/update-image', formData);

      if (data.success) {
        if (data.image) {
          setUser(prev => prev ? { ...prev, image: data.image } : prev);
        }
        toast.success(data.message);
        setImage('');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className='relative min-h-screen md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-borderColor text-sm pointer-events-none'>

      {/* IMAGE UPLOAD (FIXED ID) */}
      <div className='group relative mb-4 pointer-events-auto'>
        <label htmlFor="ownerProfileImage" className="cursor-pointer">
          <img
            src={image ? URL.createObjectURL(image) : user?.image}
            alt=""
            className="h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto"
          />

          <input
            type="file"
            id="ownerProfileImage"
            accept="image/*"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />

          <div className="absolute hidden top-0 bottom-0 left-0 right-0 bg-black/10 rounded-full group-hover:flex items-center justify-center">
            <img src={assets.edit_icon} alt="" />
          </div>
        </label>
      </div>

      {/* SAVE BUTTON */}
      {image && (
        <div className="mb-4 z-50 pointer-events-auto">
          <button
            className="bg-primary/10 text-primary px-3 py-1 rounded-lg flex items-center gap-1"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              updateImage();
            }}
          >
            Save
            <img src={assets.check_icon} width={13} alt="" />
          </button>
        </div>
      )}

      <p className="mt-2 text-base max-md:hidden pointer-events-auto">
        {user?.name}
      </p>

      {/* SIDEBAR LINKS */}
      <div className="w-full mt-6">
        {ownerMenuLinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            className={`relative flex items-center gap-2 w-full py-3 pl-4 first:mt-2 pointer-events-auto
            ${link.path === location.pathname ? "bg-primary/10 text-primary" : "text-gray-600"}`}
          >
            <img
              src={link.path === location.pathname ? link.coloredIcon : link.icon}
              alt="car icon"
            />
            <span className="max-md:hidden">{link.name}</span>

            {link.path === location.pathname && (
              <div className="bg-primary w-1.5 h-8 rounded-l right-0 absolute"></div>
            )}
          </NavLink>
        ))}
      </div>

    </div>
  );
};

export default Sidebar;
