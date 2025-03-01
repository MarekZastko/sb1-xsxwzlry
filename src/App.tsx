import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import IbanValidator from './components/IbanValidator';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import FAQ from './components/FAQ';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';
import ScrollToTopButton from './components/ScrollToTopButton';

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [validationCount, setValidationCount] = useState(0);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Handle scroll events for navbar styling and scroll button visibility
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      setShowScrollButton(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Function to increment validation count
  const handleValidation = () => {
    setValidationCount(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar isScrolled={isScrolled} validationCount={validationCount} />
      <main>
        <Hero>
          <IbanValidator onValidation={handleValidation} />
        </Hero>
        <Features />
        <HowItWorks />
        <FAQ />
        <CallToAction />
      </main>
      <Footer />
      <ScrollToTopButton show={showScrollButton} />
    </div>
  );
}

export default App;