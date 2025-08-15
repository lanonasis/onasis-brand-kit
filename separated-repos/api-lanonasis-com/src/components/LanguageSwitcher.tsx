import React, { useState, useRef, useEffect, useId } from 'react';
import { useTranslation } from 'react-i18next';

// Define languages with ISO-compliant language codes
const languages = [
  { code: 'en', fullCode: 'en-US', name: 'English', flag: '🇺🇸' },
  { code: 'es', fullCode: 'es-ES', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', fullCode: 'fr-FR', name: 'Français', flag: '🇫🇷' },
  { code: 'de', fullCode: 'de-DE', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', fullCode: 'ja-JP', name: '日本語', flag: '🇯🇵' },
  { code: 'zh', fullCode: 'zh-CN', name: '中文', flag: '🇨🇳' },
  { code: 'pt', fullCode: 'pt-PT', name: 'Português', flag: '🇵🇹' },
  { code: 'ar', fullCode: 'ar-SA', name: 'العربية', flag: '🇸🇦' },
  { code: 'ko', fullCode: 'ko-KR', name: '한국어', flag: '🇰🇷' },
  { code: 'it', fullCode: 'it-IT', name: 'Italiano', flag: '🇮🇹' },
  { code: 'ru', fullCode: 'ru-RU', name: 'Русский', flag: '🇷🇺' },
];

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const buttonId = useId();
  
  // Normalize language code to match available languages
  const normalizedLangCode = i18n.language?.split('-')[0] || 'en';
  const currentLanguage = languages.find(lang => lang.code === normalizedLangCode) || languages[0];
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
  };
  
  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef} onKeyDown={handleKeyDown}>
      <button
        id={buttonId}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-200"
        aria-label="Select Language"
        aria-haspopup="true"
        aria-expanded={isOpen ? true : false}
        aria-controls={isOpen ? menuId : undefined}
      >
        <span className="text-lg">{currentLanguage.flag}</span>
        <span className="hidden sm:inline-block font-medium">{currentLanguage.name}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop - for mobile touch devices */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Dropdown */}
          <div 
            id={menuId}
            role="menu"
            aria-labelledby={buttonId}
            className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden"
          >
            <div className="py-2" role="presentation">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  role="menuitem"
                  aria-current={currentLanguage.code === lang.code ? 'true' : undefined}
                  /* Using standard BCP 47 language tags */
                  lang={lang.fullCode}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                    currentLanguage.code === lang.code 
                      ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' 
                      : 'text-gray-700'
                  }`}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <span className="font-medium">{lang.name}</span>
                  {currentLanguage.code === lang.code && (
                    <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
            
            {/* Footer */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200" role="presentation">
              <p className="text-xs text-gray-500 text-center">
                🌐 Powered by Lingo.dev AI Translation
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};