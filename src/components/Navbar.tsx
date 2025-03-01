import React, { useState } from 'react';
import { Globe, Menu, X, CheckCircle } from 'lucide-react';

interface NavbarProps {
  isScrolled: boolean;
  validationCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ isScrolled, validationCount }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#faq", label: "FAQ" }
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}>
      <div className="container mx-auto px-4">
        <div className={`bg-white/90 backdrop-blur-sm rounded-full shadow-md py-3 px-6 flex justify-between items-center transition-all duration-300 ${isScrolled ? 'shadow-lg' : 'shadow-md'}`}>
          {/* Logo */}
          <div className="flex items-center">
            <Globe className="text-blue-600 mr-2" size={24} />
            <span className="font-bold text-xl text-gray-800">IBAN Validator</span>
          </div>
          
          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center absolute left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-8">
              {navLinks.map((link, index) => (
                <a 
                  key={index}
                  href={link.href} 
                  className="text-gray-600 hover:text-blue-600 transition-colors relative group font-medium"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </div>
          </div>
          
          {/* Validation Counter - Desktop */}
          <div className="hidden md:block">
            {validationCount > 0 && (
              <div className="bg-blue-100 text-blue-600 px-3 py-1.5 rounded-full flex items-center transition-all duration-300 animate-fadeIn shadow-sm">
                <CheckCircle size={16} className="mr-1.5" />
                <span className="font-medium">{validationCount}</span>
                <span className="ml-1 text-blue-500 font-medium">validations</span>
              </div>
            )}
          </div>
            
          {/* Mobile Menu Button and Counter */}
          <div className="md:hidden flex items-center">
            {validationCount > 0 && (
              <div className="mr-3 bg-blue-100 text-blue-600 px-2.5 py-1 rounded-full flex items-center transition-all duration-300 animate-fadeIn shadow-sm">
                <CheckCircle size={14} className="mr-1" />
                <span className="text-sm font-medium">{validationCount}</span>
              </div>
            )}
            
            <button 
              className="text-gray-600 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          mobileMenuOpen ? 'max-h-60 opacity-100 mt-2' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-md py-4 px-6 flex flex-col space-y-4">
            {navLinks.map((link, index) => (
              <a 
                key={index}
                href={link.href} 
                className="text-gray-600 hover:text-blue-600 transition-colors py-2 border-b border-gray-100 last:border-b-0 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;