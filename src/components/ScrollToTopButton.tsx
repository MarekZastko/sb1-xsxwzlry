import React from 'react';
import { ArrowUp } from 'lucide-react';

interface ScrollToTopButtonProps {
  show: boolean;
}

const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({ show }) => {
  const scrollToTop = () => {
    const validatorSection = document.getElementById('validator');
    if (validatorSection) {
      validatorSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-300 z-40 ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      }`}
      aria-label="Scroll to top"
    >
      <ArrowUp size={20} />
      <span className="absolute -top-10 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        Back to validator
      </span>
    </button>
  );
};

export default ScrollToTopButton;