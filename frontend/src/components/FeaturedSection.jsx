import Title from './Title';
import { assets } from '../assets/assets.js';
import CarCard from './CarCard';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext.jsx';
import { motion } from 'motion/react';
import { useState } from 'react';

const FeaturedSection = () => {

  const { cars } = useAppContext()
  const nav = useNavigate();
  const [input, setInput] = useState('');


  return (
    <motion.div 
    initial={{opacity:0, y:40}}
    whileInView={{opacity:1, y:0}}
    transition={{duration:1, ease:"easeOut"}}
    className="flex flex-col items-center py-24 px-6 md:px-16 lg:px-24 xl:px-32">

      {/* Section title */}
      <motion.div
        initial={{opacity:0, y:20}}
        whileInView={{opacity:1, y:0}}
        transition={{duration:1, delay:0.5}}
        >
        <Title
        title="Featured Vehicles"
        subTitle="Explore our selection of premium vehicles available for your next adventure."
      />
      </motion.div>

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
      <motion.div 
      initial={{opacity:0, y:100}}
      whileInView={{opacity:1, y:0}}
      transition={{duration:1, delay:0.5}}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
        {
          cars.slice(0,6).map((car) => (
            <motion.div 
            initial={{opacity:0, scale:0.95}}
            whileInView={{opacity:1, scale:1}}
            transition={{duration:0.4, ease:"easeOut"}}
              key={car._id}>
              <CarCard car={car} />
            </motion.div>
          ))
        }
      </motion.div>

      {/* Explore All button */}
      <motion.button
        initial={{opacity:0, y:20}}
        whileInView={{opacity:1, y:0}}
        transition={{duration:0.4, delay:0.6}}
        onClick={() => {
          nav('/cars');
          scrollTo(0, 0);
        }}
        className="flex items-center justify-center gap-2 px-6 py-2 border border-borderColor hover:bg-gray-50 rounded-md mt-12 cursor-pointer"
      >
        Explore all cars <img src={assets.arrow_icon} alt="arrow" />
      </motion.button>
    </motion.div>
  );
};

export default FeaturedSection;
