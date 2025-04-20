import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const heroImages = [assets.hero_img, assets.hero_img2, assets.hero_img3];

  // Function to change the image every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 3000); // 3000 ms = 3 seconds

    return () => clearInterval(interval); // Clear the interval when the component unmounts
  }, []);

  return (
    <div className="flex flex-col sm:flex-row border border-gray-400">
      {/* hero */}
      <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0">
        <div className="text-[#414141]">
          <div className="flex items-center gap-2">
            <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
            <p className="font-medium text-sm md:text-base">OUR BESTSELLER</p>
          </div>
          <h1 className="prata-regular text-3xl sm:py-3 lg-text-5xl leading-relaxed">
            Lastest Arrivals
          </h1>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm md:text-base">Shop Now</p>
            <p className="w-8 md:w-11 h-[1px] bg-[#414141]"></p>
          </div>
        </div>
      </div>
      {/* hero image */}
      <img 
        className="w-full sm:w-1/2" 
        src={heroImages[currentImageIndex]} 
        alt="Hero Image" 
        style={{ 
          height: '500px', 
          objectFit: 'cover',  // Ensure the image covers the area without stretching
        }} 
      />
    </div>
  );
};

export default Hero;
