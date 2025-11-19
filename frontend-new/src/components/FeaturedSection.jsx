import React, { useEffect, useState } from 'react';
import Title from './Title';
import { assets } from '../assets/assets.js';
import CarCard from './CarCard';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const FeaturedSection = () => {
  const nav = useNavigate();
  const [cars, setCars] = useState([]);
  const [input, setInput] = useState(''); // added input state for filtering

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/cars');
        console.log('Fetched cars:', response.data);
        setCars(response.data);
      } catch (error) {
        console.error('Error fetching cars:', error);
      }
    };

    fetchCars();
  }, []);

  // ✅ Use correct property names from backend:
  // brand (alias of brand_name) and model (alias of model_name)
  console.log("cars is here",cars);
  
  const filteredCars = cars.filter(
    (car) =>
      car.brand_name.toLowerCase().includes(input.toLowerCase()) ||
      car.model_name.toLowerCase().includes(input.toLowerCase()) ||
      car.category.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center py-24 px-6 md:px-16 lg:px-24 xl:px-32">
      {/* Section title */}
      <Title
        title="Featured Vehicles"
        subTitle="Explore our selection of premium vehicles available for your next adventure."
      />

      {/* Optional search input */}
      <div className="flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow">
        <img src={assets.search_icon} alt="search" className="w-4.5 h-4.5 mr-2" />
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          placeholder="Search by brand, model, or category"
          className="w-full h-full outline-none text-gray-500"
        />
        <img src={assets.filter_icon} alt="filter" className="w-4.5 h-4.5 ml-2" />
      </div>

      {/* Cars grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
        {filteredCars.length > 0 ? (
          filteredCars.map((car) => (
            <div key={car.car_id}>
              <CarCard car={car} />
            </div>
          ))
        ) : (
          <p className="text-gray-500">No cars found.</p>
        )}
      </div>

      {/* Explore All button */}
      <button
        onClick={() => {
          nav('/cars');
          scrollTo(0, 0);
        }}
        className="flex items-center justify-center gap-2 px-6 py-2 border border-borderColor hover:bg-gray-50 rounded-md mt-12 cursor-pointer"
      >
        Explore all cars <img src={assets.arrow_icon} alt="arrow" />
      </button>
    </div>
  );
};

export default FeaturedSection;
