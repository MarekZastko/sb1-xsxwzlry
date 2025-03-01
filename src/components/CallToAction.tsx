import React, { useRef, useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

const CallToAction: React.FC = () => {
  const ctaRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Animation when scrolled into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (ctaRef.current) {
      observer.observe(ctaRef.current);
    }

    return () => {
      if (ctaRef.current) {
        observer.unobserve(ctaRef.current);
      }
    };
  }, []);

  return (
    <section className="py-16 bg-gray-50 relative overflow-hidden" ref={ctaRef}>
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-100 via-indigo-200 to-blue-100 opacity-50"></div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className={`bg-blue-600 rounded-xl shadow-lg overflow-hidden relative transition-all duration-500 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500 rounded-full opacity-20 transform translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500 rounded-full opacity-20 transform -translate-x-12 translate-y-12"></div>
          
          <div className="py-12 px-6 md:px-12 text-center text-white relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to validate your IBAN?</h2>
            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
              Our tool is free, secure, and provides instant results. Try it now to ensure your international transfers go smoothly.
            </p>
            <a 
              href="#validator" 
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-300 shadow-md hover:shadow-lg group"
            >
              Validate your IBAN
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;