import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const heroImages = [assets.hero_img, assets.hero_img2, assets.hero_img3];
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[500px] overflow-hidden rounded-xl shadow-lg">
      {/* Background image */}
      <img 
        src={heroImages[currentImageIndex]} 
        alt="Hero" 
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 opacity-100"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full px-6 sm:px-12">
        <div className="text-white text-center max-w-xl">
          <p className="uppercase tracking-wider text-sm mb-2">Our Bestseller</p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 drop-shadow-lg">Latest Arrivals</h1>
          <p className="mb-6 text-sm sm:text-base text-white/90">Khám phá những sản phẩm mới nhất của chúng tôi – đầy phong cách và thời thượng.</p>
          <button onClick={() => navigate('/collection')} className="bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-indigo-600 hover:text-white transition duration-300">
            Mua ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
