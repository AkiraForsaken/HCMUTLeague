import React from 'react';
import { assets } from '../assets/assets';

const MainBanner = () => {
  return (
    <div className="relative w-full h-[90vh] overflow-hidden bg-gray-900">
      {/* Background Image with Gentle Fade */}
      <img
        src={assets.soccer_banner}
        alt="Soccer Banner"
        className="absolute inset-0 w-full h-full object-cover opacity-70 animate-gentle-fade"
      />

      {/* Content Container */}
      <div className="mx-auto max-w-[1600px] absolute inset-0 flex items-center justify-start px-8 md:px-20">
        <div className="flex flex-col items-start max-w-[80%] animate-smooth-reveal z-1000">
          {/* Main Title with Professional Typography */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-5 tracking-tight font-['Montserrat'] animate-slide-up">
            Experience the <br />
            <span className="bg-gradient-to-r from-indigo-700 via-purple-600 to-indigo-500 text-transparent bg-clip-text">HCMUT Premier League</span>
          </h1>

          {/* Subtitle with Refined Clarity */}
          <p className="text-xl sm:text-2xl md:text-3xl font-medium text-gray-200 mb-8 animate-slide-up delay-200 font-['Montserrat']">
            Where Passion Meets Excellence in Sports
          </p>

          {/* Call to Action Button with Sleek Hover */}
          <a
            href="matches"
            className="px-10 py-4 bg-gradient-to-r from-indigo-900 via-purple-800 to-indigo-700 hover:bg-gradient-to-r hover:from-indigo-800 hover:via-purple-700 hover:to-indigo-600 text-white font-semibold text-lg rounded-lg shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 animate-cta-reveal font-['Montserrat']">
            Discover Now
          </a>
        </div>
      </div>

      {/* Subtle Overlay for Elegance */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/20 to-gray-900/60 animate-overlay-smooth" />
    </div>
  );
};

export default MainBanner;