import React from 'react';

export default function AboutUs() {
  return (
    <div className="flex flex-col gap-16 pb-8 overflow-hidden w-full">
      {/* Full-width Hero Image Section */}
      <div className="w-full relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <img 
          src="/about-hero.jpg" 
          alt="Fashion Inspiration" 
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center flex flex-col items-center max-w-3xl animate-[slideInDown_1s_ease-out]">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-wider drop-shadow-xl uppercase">
            About Us
          </h1>
          <p className="text-xl md:text-2xl text-white/95 leading-relaxed font-medium drop-shadow-lg">
            Empowering your everyday style with thoughtfully curated collections. Experience the perfect blend of timeless elegance and modern comfort.
          </p>
        </div>
      </div>

      {/* Additional Details */}
      <div className="max-w-4xl mx-auto text-center px-4 -mt-4">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6 uppercase tracking-wider">Our Mission</h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
          Welcome to our world of fashion! We believe that style is a way to express who you are without having to speak. Our collections are designed to bring you high-quality pieces that make you feel confident and comfortable.
        </p>
        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          From chic outerwear to the perfect everyday denim, every item is carefully selected to ensure you always look your best, no matter where life takes you.
        </p>
      </div>
    </div>
  );
}
