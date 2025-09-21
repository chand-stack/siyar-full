import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaGlobe } from 'react-icons/fa';

interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className = ''
}) => {
  const { i18n, t } = useTranslation();

  const languages = [
    { code: 'en', label: t('language.english'), nativeName: 'English' },
    { code: 'ar', label: t('language.arabic'), nativeName: 'العربية' },
    { code: 'id', label: t('language.bahasa'), nativeName: 'Bahasa Indonesia' },
    { code: 'tr', label: t('language.turkish'), nativeName: 'Türkçe' },
  ];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    
    // Update document direction for RTL languages
    if (languageCode === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = languageCode;
    }
  };

  const currentLanguage = i18n.language;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <FaGlobe className="text-[#0054FF] text-lg" />
      <div className="flex items-center gap-1">
        {languages.map((lang) => {
          const isCurrentLang = currentLanguage === lang.code;
          
          return (
            <button
              key={lang.code}
              className={`
                relative px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                ${isCurrentLang 
                  ? 'bg-[#0054FF] text-white shadow-md' 
                  : 'text-[#0054FF] hover:bg-[#0054FF]/10'
                }
                cursor-pointer hover:scale-105
              `}
              onClick={() => handleLanguageChange(lang.code)}
              title={`Switch to ${lang.nativeName}`}
            >
              <span className="flex items-center gap-2">
                {lang.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LanguageSwitcher;
