import React from 'react';

interface HeroProps {
  children: React.ReactNode;
}

const Hero: React.FC<HeroProps> = ({ children }) => {
  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-24 relative overflow-hidden" id="validator">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-72 h-72 bg-blue-100 rounded-full opacity-20 animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-40 -left-20 w-80 h-80 bg-indigo-100 rounded-full opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-0 right-20 w-60 h-60 bg-blue-100 rounded-full opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight">
            Validate Your IBAN <span className="text-blue-600 relative">
              Instantly
              <span className="absolute bottom-1 left-0 w-full h-2 bg-blue-100 -z-10 transform -rotate-1"></span>
            </span>
          </h1>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Our powerful IBAN validator ensures your international bank account numbers are correct, helping you avoid payment delays and fees.
          </p>
        </div>
        <div className="w-full flex justify-center">
          {children}
        </div>
      </div>
    </section>
  );
};

export default Hero;