import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQ: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const faqRef = useRef<HTMLDivElement>(null);

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

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

    if (faqRef.current) {
      observer.observe(faqRef.current);
    }

    return () => {
      if (faqRef.current) {
        observer.unobserve(faqRef.current);
      }
    };
  }, []);

  const faqItems = [
    {
      id: 'faq1',
      question: 'What is an IBAN?',
      answer: 'IBAN (International Bank Account Number) is an internationally agreed system of identifying bank accounts across national borders to facilitate the communication and processing of cross-border transactions. It consists of up to 34 alphanumeric characters comprising a country code, check digits, and a bank account number.'
    },
    {
      id: 'faq2',
      question: 'Why should I validate my IBAN?',
      answer: 'Validating your IBAN before making international transfers helps prevent payment delays, additional fees, and potential payment returns. Many banks charge fees for failed transfers due to incorrect account details, so validation can save you time and money.'
    },
    {
      id: 'faq3',
      question: 'Is my data secure when using this validator?',
      answer: 'Yes, your data is completely secure. Our IBAN validator processes all information locally in your browser. We don\'t store, transmit, or share any of the IBANs you validate. No data is sent to our servers or third parties.'
    },
    {
      id: 'faq4',
      question: 'Can validation guarantee my payment will be successful?',
      answer: 'Our validator checks the format and structure of the IBAN to ensure it\'s technically valid. However, it cannot verify if the account exists, is active, or belongs to your intended recipient. Always double-check with your recipient that the details are correct.'
    },
    {
      id: 'faq5',
      question: 'Which countries\' IBANs can I validate?',
      answer: 'Our validator supports IBANs from all countries that use the IBAN system, including all European countries, as well as many countries in the Middle East, Caribbean, and other regions. In total, we support over 70 countries.'
    }
  ];

  return (
    <section id="faq" className="py-20 bg-gray-50 relative overflow-hidden" ref={faqRef}>
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-100 via-indigo-200 to-blue-100 opacity-50"></div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center bg-blue-100 text-blue-600 p-2 rounded-full mb-3">
            <HelpCircle size={24} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Find answers to common questions about IBAN validation and our service.</p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqItems.map((item, index) => (
            <div 
              key={item.id}
              className={`mb-4 transition-all duration-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <button 
                className={`w-full flex justify-between items-center p-5 rounded-lg transition-all duration-300 ${
                  activeSection === item.id 
                    ? 'bg-white shadow-sm border-l-2 border-blue-500' 
                    : 'bg-white hover:bg-gray-50'
                }`}
                onClick={() => toggleSection(item.id)}
                aria-expanded={activeSection === item.id}
                aria-controls={`content-${item.id}`}
              >
                <span className={`font-medium text-left ${activeSection === item.id ? 'text-blue-600' : 'text-gray-700'}`}>
                  {item.question}
                </span>
                <div className={`flex items-center justify-center transition-transform duration-300 ${
                  activeSection === item.id ? 'rotate-180' : ''
                }`}>
                  <ChevronDown size={20} className={activeSection === item.id ? 'text-blue-500' : 'text-gray-400'} />
                </div>
              </button>
              <div 
                id={`content-${item.id}`}
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  activeSection === item.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-5 bg-white border-l-2 border-blue-100">
                  <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;