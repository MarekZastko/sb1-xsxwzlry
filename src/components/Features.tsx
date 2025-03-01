import React, { useRef, useEffect, useState } from 'react';
import { Shield, Globe, Zap } from 'lucide-react';

const Features: React.FC = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }

    return () => {
      if (featuresRef.current) {
        observer.unobserve(featuresRef.current);
      }
    };
  }, []);

  const features = [
    {
      icon: <Shield className="text-blue-600" size={24} />,
      title: "Accurate Validation",
      description: "Our algorithm checks the structure, length, and checksum of your IBAN to ensure it's valid according to international standards."
    },
    {
      icon: <Globe className="text-blue-600" size={24} />,
      title: "Bank Information",
      description: "Get detailed information about the bank associated with the IBAN, including country code, bank code, and account details."
    },
    {
      icon: <Zap className="text-blue-600" size={24} />,
      title: "Instant Results",
      description: "Get validation results instantly, with no need to wait or refresh the page. Perfect for quick verification before making transfers."
    }
  ];

  return (
    <section id="features" className="py-16 bg-gray-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-100 via-indigo-200 to-blue-100"></div>
      </div>
      
      <div className="container mx-auto px-4" ref={featuresRef}>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Key Features</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Our IBAN validator provides comprehensive validation and information to ensure your international transfers go smoothly.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-500 transform hover:-translate-y-1 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;