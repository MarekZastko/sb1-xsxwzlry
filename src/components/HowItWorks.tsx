import React, { useRef, useState, useEffect } from 'react';
import { ArrowRight, Lightbulb, CheckCircle2, Zap } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Animate steps when scrolled into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const steps = [
    {
      icon: <Lightbulb size={24} className="text-blue-500" />,
      title: "Enter Your IBAN",
      description: "Input your International Bank Account Number in the validator field.",
    },
    {
      icon: <Zap size={24} className="text-indigo-500" />,
      title: "Instant Validation",
      description: "Our system verifies the structure, country code, and performs the MOD-97 check.",
    },
    {
      icon: <CheckCircle2 size={24} className="text-green-500" />,
      title: "Get Results",
      description: "Receive detailed information about your bank account and validation status.",
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white relative overflow-hidden" ref={sectionRef}>
      {/* Subtle background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-b from-blue-50 to-transparent opacity-60 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-t from-indigo-50 to-transparent opacity-60 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-medium mb-4">How It Works</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Simple Steps to Validate Your IBAN</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Our validation process is straightforward and efficient, designed to give you instant results.</p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Steps */}
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`transition-all duration-700 transform ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                } bg-white rounded-xl p-8 border border-gray-100 hover:border-blue-100 shadow-sm hover:shadow-md group`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="flex flex-col h-full">
                  {/* Step number and icon */}
                  <div className="flex items-center mb-5">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mr-3 group-hover:bg-blue-50 transition-colors duration-300">
                      {step.icon}
                    </div>
                    <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                      Step {index + 1}
                    </span>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 mb-6 flex-grow">
                    {step.description}
                  </p>
                  
                  {/* Visual indicator */}
                  <div className="w-12 h-1 rounded-full bg-gray-100 group-hover:bg-blue-400 transition-colors duration-300"></div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Call to action */}
          <div className="text-center mt-16">
            <a 
              href="#validator" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow group"
            >
              Try it now
              <ArrowRight size={18} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;