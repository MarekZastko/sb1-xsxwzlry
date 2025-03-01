import React, { useState, useRef, useEffect } from 'react';
import { Globe, RefreshCw, Check, Copy, AlertCircle, Info, ChevronRight, X, Clock, Sparkles, Search, MapPin, Building, CreditCard, Hash, Flag, Ban as Bank } from 'lucide-react';
import { IbanInfo } from '../types';
import { validateIban, formatIban, generateRandomIban } from '../utils/ibanUtils';

interface IbanValidatorProps {
  onValidation?: () => void;
}

const IbanValidator: React.FC<IbanValidatorProps> = ({ onValidation }) => {
  const [iban, setIban] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [ibanInfo, setIbanInfo] = useState<IbanInfo | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [animateValidator, setAnimateValidator] = useState(false);
  const [focusedInput, setFocusedInput] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [validationCount, setValidationCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [validationProgress, setValidationProgress] = useState(0);
  const [recentValidations, setRecentValidations] = useState<Array<{iban: string, timestamp: number, isValid: boolean}>>([]);
  const [showRecentPanel, setShowRecentPanel] = useState(false);
  const [generatingRandom, setGeneratingRandom] = useState(false);
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  
  const validatorRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recentPanelRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Example IBANs for the placeholder
  const placeholderIbans = [
    'DE89 3704 0044 0532 0130 00',
    'GB29 NWBK 6016 1331 9268 19',
    'FR14 2004 1010 0505 0001 3M02 606',
    'IT60 X054 2811 1010 0000 0123 456',
    'ES91 2100 0418 4502 0005 1332',
    'NL91 ABNA 0417 1643 00',
    'CH93 0076 2011 6238 5295 7',
    'AT61 1904 3002 3457 3201'
  ];

  // Current placeholder text that changes with typing animation
  const [placeholderText, setPlaceholderText] = useState('');
  const [isPlaceholderVisible, setIsPlaceholderVisible] = useState(true);

  // Handle IBAN input change
  const handleIbanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '').toUpperCase();
    setIban(formatIban(value));
    setIsTyping(true);
    
    // Hide the placeholder when user is typing
    setIsPlaceholderVisible(false);
    
    // Reset typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set a timeout to consider user has stopped typing
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      // Only show placeholder again if input is empty
      if (!value) {
        setIsPlaceholderVisible(true);
      }
    }, 1000);
    
    // Reset validation state when input changes
    if (isValid !== null) {
      setIsValid(null);
      setIbanInfo(null);
      setErrorMessage(null);
    }
  };

  // Clear input field
  const clearInput = () => {
    setIban('');
    setIsValid(null);
    setIbanInfo(null);
    setErrorMessage(null);
    setIsPlaceholderVisible(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Generate a random IBAN
  const handleGenerateRandom = () => {
    setGeneratingRandom(true);
    
    // Add a small delay to show the loading state
    setTimeout(() => {
      try {
        const randomIban = generateRandomIban();
        setIban(formatIban(randomIban));
        setIsValid(null);
        setIbanInfo(null);
        setErrorMessage(null);
        setIsPlaceholderVisible(false);
        
        // Automatically validate the generated IBAN
        setTimeout(() => {
          validateIbanInput(randomIban);
        }, 300);
      } catch (error) {
        setErrorMessage('Error generating random IBAN');
      } finally {
        setGeneratingRandom(false);
      }
    }, 400);
  };

  // Scroll to results after validation
  const scrollToResults = () => {
    if (resultRef.current) {
      // Use a small timeout to ensure the DOM has updated
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'nearest'
        });
      }, 100);
    }
  };

  // Validate IBAN with animated progress
  const validateIbanInput = (ibanToValidate: string = iban) => {
    if (!ibanToValidate.trim()) {
      setErrorMessage('Please enter an IBAN');
      setIsValid(false);
      setIbanInfo(null);
      return;
    }

    setIsValidating(true);
    setErrorMessage(null);
    
    // Animated validation progress
    setValidationProgress(0);
    const progressInterval = setInterval(() => {
      setValidationProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 5;
      });
    }, 30);
    
    // Simulate network delay for better UX
    setTimeout(() => {
      clearInterval(progressInterval);
      setValidationProgress(100);
      
      const result = validateIban(ibanToValidate);
      setIsValid(result.isValid);
      
      if (result.isValid && result.ibanInfo) {
        setIbanInfo(result.ibanInfo);
        setErrorMessage(null);
        setValidationCount(prev => prev + 1);
        
        // Call the onValidation callback if provided
        if (onValidation) {
          onValidation();
        }
        
        // Add to recent validations
        const cleanIban = ibanToValidate.replace(/\s/g, '');
        const existingIndex = recentValidations.findIndex(item => item.iban.replace(/\s/g, '') === cleanIban);
        
        if (existingIndex !== -1) {
          // Update existing entry with new timestamp
          const updatedValidations = [...recentValidations];
          updatedValidations[existingIndex] = {
            ...updatedValidations[existingIndex],
            timestamp: Date.now()
          };
          setRecentValidations(updatedValidations);
        } else {
          // Add new entry
          setRecentValidations(prev => [
            { iban: result.ibanInfo.formattedIban, timestamp: Date.now(), isValid: true },
            ...prev
          ].slice(0, 10)); // Keep up to 10 recent validations
        }
        
        // Show confetti on successful validation
        if (validationCount < 3) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 2500);
        }
      } else {
        setIbanInfo(null);
        setErrorMessage(result.errorMessage || 'Invalid IBAN');
        
        // Add to recent validations even if invalid
        setRecentValidations(prev => [
          { iban: formatIban(ibanToValidate), timestamp: Date.now(), isValid: false },
          ...prev
        ].slice(0, 10));
      }
      
      setIsValidating(false);
      
      // Scroll to results after validation is complete
      scrollToResults();
    }, 600);
  };

  const copyToClipboard = (textToCopy: string = iban) => {
    navigator.clipboard.writeText(textToCopy.replace(/\s/g, ''));
    setCopied(textToCopy);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    validateIbanInput();
  };

  // Toggle recent validations panel
  const toggleRecentPanel = () => {
    setShowRecentPanel(!showRecentPanel);
  };

  // Format timestamp to relative time
  const formatRelativeTime = (timestamp: number): string => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  // Close panels when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (recentPanelRef.current && !recentPanelRef.current.contains(event.target as Node)) {
        setShowRecentPanel(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Add animation when scrolling to validator
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimateValidator(true);
        }
      },
      { threshold: 0.2 }
    );

    if (validatorRef.current) {
      observer.observe(validatorRef.current);
    }

    return () => {
      if (validatorRef.current) {
        observer.unobserve(validatorRef.current);
      }
    };
  }, []);

  // Auto-format IBAN as user types
  useEffect(() => {
    if (iban.length > 0 && !isValidating) {
      const timer = setTimeout(() => {
        setIban(formatIban(iban.replace(/\s/g, '')));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [iban, isValidating]);

  // Typing animation for placeholder
  useEffect(() => {
    if (!isPlaceholderVisible || isTyping || iban) return;

    let currentIban = placeholderIbans[currentPlaceholderIndex];
    let currentPosition = 0;
    let isTypingForward = true;
    
    const typingInterval = setInterval(() => {
      if (isTypingForward) {
        // Typing forward
        if (currentPosition <= currentIban.length) {
          setPlaceholderText(currentIban.substring(0, currentPosition));
          currentPosition++;
        } else {
          // Pause at the end before deleting
          isTypingForward = false;
          setTimeout(() => {
            currentPosition = currentIban.length;
          }, 1500);
        }
      } else {
        // Deleting
        if (currentPosition > 0) {
          currentPosition--;
          setPlaceholderText(currentIban.substring(0, currentPosition));
        } else {
          // Move to next IBAN
          isTypingForward = true;
          setCurrentPlaceholderIndex((prev) => (prev + 1) % placeholderIbans.length);
          currentIban = placeholderIbans[(currentPlaceholderIndex + 1) % placeholderIbans.length];
          currentPosition = 0;
          // Pause before starting to type the next one
          setTimeout(() => {}, 500);
        }
      }
    }, isTypingForward ? 100 : 50);

    return () => clearInterval(typingInterval);
  }, [isPlaceholderVisible, isTyping, iban, currentPlaceholderIndex]);

  // Clean up typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="max-w-4xl w-full mx-auto" ref={validatorRef}>
      <div className={`transition-all duration-500 transform ${animateValidator ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        {/* Input Section - Enhanced with decorative elements */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50 rounded-full opacity-20 transform translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-50 rounded-full opacity-20 transform -translate-x-12 translate-y-12"></div>
          
          <form onSubmit={handleSubmit} className="p-8 relative z-10">
            <div className="flex flex-col items-center mb-8 text-center">
              <div className="bg-blue-50 p-3 rounded-full mb-4 relative shadow-sm hover:shadow-md transition-all duration-300 group">
                <Globe size={28} className="text-blue-600 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2 relative">
                Validate Your IBAN
              </h3>
              <p className="text-gray-500 max-w-lg mx-auto">Enter your International Bank Account Number below for instant verification</p>
            </div>
            
            <div className="relative mb-10">
              <div 
                className={`relative flex items-center overflow-hidden rounded-lg transition-all duration-300 ${
                  focusedInput 
                    ? 'ring-2 ring-blue-400 shadow-md border border-blue-200' 
                    : isValid === true
                      ? 'bg-white border-2 border-green-100 hover:border-green-200'
                      : isValid === false
                        ? 'bg-white border-2 border-red-100 hover:border-red-200'
                        : 'bg-gray-50 hover:bg-white border-2 border-gray-100 hover:border-blue-100'
                }`}
              >
                <input
                  ref={inputRef}
                  type="text"
                  id="iban"
                  value={iban}
                  onChange={handleIbanChange}
                  onFocus={() => {
                    setFocusedInput(true);
                    setIsPlaceholderVisible(false);
                  }}
                  onBlur={() => {
                    setFocusedInput(false);
                    if (!iban) {
                      setIsPlaceholderVisible(true);
                    }
                  }}
                  className="w-full px-6 py-4 text-base border-0 focus:ring-0 focus:outline-none bg-transparent"
                  autoComplete="off"
                />
                
                {/* Dynamic placeholder that looks like someone is typing */}
                {isPlaceholderVisible && !iban && !focusedInput && (
                  <div className="absolute left-6 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400 flex items-center">
                    <span>{placeholderText}</span>
                    <span className="h-4 w-0.5 bg-gray-400 ml-0.5 animate-pulse"></span>
                  </div>
                )}
                
                <div className="flex items-center">
                  {iban && (
                    <button
                      type="button"
                      onClick={clearInput}
                      className="text-gray-400 hover:text-gray-600 p-2 focus:outline-none transition-colors"
                      aria-label="Clear input"
                    >
                      <X size={18} />
                    </button>
                  )}
                  
                  <button
                    type="submit"
                    className={`mr-2 p-3 rounded-full transition-all duration-300 ${
                      isValidating 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md hover:scale-105'
                    }`}
                    disabled={isValidating}
                    aria-label="Validate IBAN"
                  >
                    {isValidating ? (
                      <RefreshCw size={18} className="animate-spin" />
                    ) : (
                      <Search size={18} />
                    )}
                  </button>
                </div>
              </div>
              
              {/* Generate random IBAN and What is an IBAN in the same row */}
              <div className="flex items-center justify-between mt-3">
                <div className="flex-1">
                  {/* Info tooltip - aligned with Generate random IBAN */}
                  <div>
                    <div 
                      className="text-gray-400 hover:text-blue-500 cursor-pointer flex items-center text-xs transition-colors"
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                    >
                      <Info size={12} className="mr-1" />
                      <span>What is an IBAN?</span>
                    </div>
                    {showTooltip && (
                      <div className="absolute left-0 top-6 bg-white p-3 rounded-md shadow-md text-xs w-64 z-20 animate-fadeIn border border-gray-100">
                        <p className="text-gray-600">
                          An International Bank Account Number (IBAN) is a standard international numbering system for bank accounts.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={handleGenerateRandom}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center transition-colors group"
                  disabled={generatingRandom}
                >
                  {generatingRandom ? (
                    <RefreshCw size={14} className="mr-1.5 animate-spin" />
                  ) : (
                    <Sparkles size={14} className="mr-1.5" />
                  )}
                  <span>{generatingRandom ? "Generating..." : "Generate random IBAN"}</span>
                </button>
              </div>
            </div>
            
            {/* Recent validations section - moved below Generate random IBAN */}
            {recentValidations.length > 0 && (
              <div className="mb-4">
                <button
                  type="button"
                  onClick={toggleRecentPanel}
                  className="w-full text-sm text-gray-600 hover:text-blue-600 flex items-center justify-center py-2 px-3 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors group"
                >
                  <Clock size={14} className="mr-1.5" />
                  <span>Recent validations</span>
                  <span className="ml-1.5 bg-gray-200 text-gray-700 rounded-full w-5 h-5 flex items-center justify-center text-xs group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                    {recentValidations.length}
                  </span>
                </button>
                
                {/* Recent validations panel */}
                {showRecentPanel && (
                  <div 
                    ref={recentPanelRef}
                    className="mt-2 bg-white rounded-lg shadow-lg border border-gray-100 w-full z-30 dropdown-fade"
                  >
                    <div className="p-3 border-b border-gray-100 flex justify-between items-center">
                      <h4 className="font-medium text-gray-800">Recent validations</h4>
                      <button 
                        onClick={toggleRecentPanel}
                        className="text-gray-400 hover:text-gray-600 p-1"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    
                    <div className="max-h-80 overflow-y-auto">
                      {recentValidations.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          No recent validations
                        </div>
                      ) : (
                        <ul className="divide-y divide-gray-100">
                          {recentValidations.map((item, index) => (
                            <li key={index} className="p-3 hover:bg-gray-50 transition-colors">
                              <div className="flex justify-between items-center mb-1">
                                <div className="flex items-center">
                                  {item.isValid ? (
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                  ) : (
                                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                                  )}
                                  <span className="text-xs text-gray-500">
                                    {formatRelativeTime(item.timestamp)}
                                  </span>
                                </div>
                                <div className="flex space-x-1">
                                  <button
                                    onClick={() => {
                                      setIban(item.iban);
                                      setIsValid(null);
                                      setIbanInfo(null);
                                      setErrorMessage(null);
                                      setShowRecentPanel(false);
                                      setIsPlaceholderVisible(false);
                                      if (inputRef.current) {
                                        inputRef.current.focus();
                                      }
                                    }}
                                    className="text-xs bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600 p-1 rounded transition-colors"
                                    title="Use this IBAN"
                                  >
                                    <Search size={14} />
                                  </button>
                                  <button
                                    onClick={() => copyToClipboard(item.iban)}
                                    className="text-xs bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600 p-1 rounded transition-colors"
                                    title={copied === item.iban ? "Copied!" : "Copy to clipboard"}
                                  >
                                    {copied === item.iban ? (
                                      <Check size={14} className="text-green-500" />
                                    ) : (
                                      <Copy size={14} />
                                    )}
                                  </button>
                                </div>
                              </div>
                              <div className="font-mono text-sm text-gray-800 break-all">
                                {item.iban}
                              </div>
                              <div className="text-xs mt-1">
                                {item.isValid ? (
                                  <span className="text-green-600">Valid IBAN</span>
                                ) : (
                                  <span className="text-red-600">Invalid IBAN</span>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    
                    {recentValidations.length > 0 && (
                      <div className="p-2 border-t border-gray-100">
                        <button
                          onClick={() => setRecentValidations([])}
                          className="w-full text-xs text-gray-500 hover:text-red-500 py-1.5 hover:bg-red-50 rounded transition-colors"
                        >
                          Clear history
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Validation progress bar */}
            {isValidating && (
              <div className="h-1 w-full bg-gray-100 rounded-full mt-6 overflow-hidden">
                <div 
                  className="h-full bg-blue-500 validation-progress rounded-full"
                  style={{ width: `${validationProgress}%` }}
                ></div>
              </div>
            )}
            
            {errorMessage && !isValidating && (
              <div className="text-sm text-red-500 flex items-center animate-fadeIn mt-6 bg-red-50 p-3 rounded-lg">
                <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </form>
        </div>

        {/* Results Section - Redesigned to be more minimalist */}
        {isValid !== null && (
          <div ref={resultRef} className="animate-fadeIn relative mt-6">
            {/* Confetti effect for valid IBANs */}
            {showConfetti && isValid && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="confetti-container">
                  {[...Array(20)].map((_, i) => (
                    <div 
                      key={i}
                      className="confetti"
                      style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`,
                        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'][Math.floor(Math.random() * 6)]
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
            
            <div className={`rounded-lg shadow-sm overflow-hidden transition-all duration-300 border ${
              isValid 
                ? 'border-l-4 border-l-green-500 border-t-gray-100 border-r-gray-100 border-b-gray-100' 
                : 'border-l-4 border-l-red-500 border-t-gray-100 border-r-gray-100 border-b-gray-100'
            }`}>
              {/* Header section with status */}
              <div className="p-4 flex items-center justify-between bg-white">
                <div className="flex items-center">
                  {isValid ? (
                    <div className="bg-green-100 p-1.5 rounded-full mr-2.5">
                      <Check className="text-green-500 animate-success" size={16} />
                    </div>
                  ) : (
                    <div className="bg-red-100 p-1.5 rounded-full mr-2.5">
                      <AlertCircle className="text-red-500 animate-error" size={16} />
                    </div>
                  )}
                  <h2 className="text-base font-medium text-gray-800">
                    {isValid ? 'Valid IBAN' : 'Invalid IBAN'}
                  </h2>
                </div>
                
                {isValid && (
                  <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-medium">
                    Verified
                  </span>
                )}
                
                {!isValid && (
                  <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-medium">
                    Error
                  </span>
                )}
              </div>

              {/* Content section - Redesigned to be more minimalist */}
              <div className="bg-white p-4">
                {isValid && ibanInfo && (
                  <div className="space-y-4">
                    {/* IBAN display with copy button */}
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                      <div className="font-mono text-sm text-gray-800">
                        {ibanInfo.formattedIban}
                      </div>
                      <button 
                        onClick={() => copyToClipboard(ibanInfo.formattedIban)}
                        className="text-gray-400 hover:text-blue-600 transition-colors p-1.5 rounded-full hover:bg-blue-50"
                        title={copied === ibanInfo.formattedIban ? "Copied!" : "Copy to clipboard"}
                      >
                        {copied === ibanInfo.formattedIban ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                      </button>
                    </div>
                    
                    {/* IBAN details in a minimalist layout with icons */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3 rounded-md bg-gray-50 flex items-center">
                        <div className="bg-blue-50 p-2 rounded-full mr-3">
                          <Flag size={16} className="text-blue-500" />
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 block">Country</span>
                          <div className="flex items-center">
                            <span className="font-medium text-gray-800 text-sm">
                              {ibanInfo.country}
                            </span>
                            <span className="ml-2 bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded text-xs">
                              {ibanInfo.countryCode}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 rounded-md bg-gray-50 flex items-center">
                        <div className="bg-indigo-50 p-2 rounded-full mr-3">
                          <Bank size={16} className="text-indigo-500" />
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 block">Bank Code</span>
                          <div>
                            <span className="font-medium text-gray-800 text-sm">
                              {ibanInfo.bankCode || 'N/A'}
                            </span>
                            {ibanInfo.bankName && (
                              <span className="block text-xs text-blue-600 mt-0.5">
                                {ibanInfo.bankName}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 rounded-md bg-gray-50 flex items-center">
                        <div className="bg-blue-50 p-2 rounded-full mr-3">
                          <CreditCard size={16} className="text-blue-500" />
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 block">Account Number</span>
                          <span className="font-medium text-gray-800 text-sm font-mono">
                            {ibanInfo.accountNumber}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-3 rounded-md bg-gray-50 flex items-center">
                        <div className="bg-green-50 p-2 rounded-full mr-3">
                          <Hash size={16} className="text-green-500" />
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 block">Check Digits</span>
                          <div>
                            <span className="font-medium text-gray-800 text-sm font-mono">
                              {ibanInfo.checkDigits}
                            </span>
                            <div className="flex items-center mt-0.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1"></div>
                              <span className="text-xs text-green-600">MOD-97 check passed</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Success message - more minimalist */}
                    <div className="flex items-start text-sm bg-green-50 p-3 rounded-md border border-green-100">
                      <Check size={16} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">
                        This IBAN has the correct structure and passes all validation checks.
                      </span>
                    </div>
                    
                    <div className="mt-2">
                      <a href="#how-it-works" className="text-sm text-blue-600 hover:text-blue-800 flex items-center group">
                        Learn how validation works
                        <ChevronRight size={14} className="ml-1 group-hover:translate-x-0.5 transition-transform" />
                      </a>
                    </div>
                  </div>
                )}

                {!isValid && errorMessage && (
                  <div className="space-y-4">
                    {/* Error message - more minimalist */}
                    <div className="flex items-start text-sm bg-red-50 p-3 rounded-md border border-red-100">
                      <AlertCircle className="text-red-500 mr-2 flex-shrink-0 mt-0.5" size={16} />
                      <span className="text-gray-700">{errorMessage}</span>
                    </div>
                    
                    {/* Helpful tips - more minimalist */}
                    <div className="bg-gray-50 rounded-md p-3 border border-gray-100">
                      <h3 className="font-medium text-gray-800 mb-2 text-sm">Common issues:</h3>
                      <ul className="space-y-1.5">
                        <li className="flex items-center text-gray-600 text-xs">
                          <div className="w-1 h-1 bg-red-400 rounded-full mr-2"></div>
                          <span>Incorrect country code (first two letters)</span>
                        </li>
                        <li className="flex items-center text-gray-600 text-xs">
                          <div className="w-1 h-1 bg-red-400 rounded-full mr-2"></div>
                          <span>Wrong length for the specified country</span>
                        </li>
                        <li className="flex items-center text-gray-600 text-xs">
                          <div className="w-1 h-1 bg-red-400 rounded-full mr-2"></div>
                          <span>Invalid check digits (positions 3-4)</span>
                        </li>
                      </ul>
                      
                      <div className="mt-3">
                        <a href="#how-it-works" className="text-xs text-blue-600 hover:text-blue-800 flex items-center bg-blue-50 hover:bg-blue-100 transition-colors px-3 py-1.5 rounded-md inline-flex group">
                          Learn more
                          <ChevronRight size={14} className="ml-1 group-hover:translate-x-0.5 transition-transform" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IbanValidator;