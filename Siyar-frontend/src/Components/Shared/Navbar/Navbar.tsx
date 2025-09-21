import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { CiMenuFries, CiSearch, CiCircleRemove } from "react-icons/ci";
import { Link, useLocation } from "react-router";
import enLogo from "../../../assets/logo.png";
import arabLogo from "../../../assets/arab-logo.png";
import indoLogo from "../../../assets/indo-logo.png";
import turkishLogo from "../../../assets/turke-logo.png";
import { useTranslation } from "react-i18next";
import { FaChevronDown, FaTimes } from "react-icons/fa";
import { useGetArticlesQuery } from "../../../Redux/api/articleApi";
import { useGetCategoriesQuery } from "../../../Redux/api/categoryApi";
import { googleTranslationService, type SupportedLanguage } from "../../../services/googleTranslationService";
import type { IArticle } from "../../../Redux/api/articleApi";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [whySiyarOpen, setWhySiyarOpen] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedArticles, setTranslatedArticles] = useState<Array<{
    _id: string;
    title: string;
    subtitle?: string;
    translatedTitle: string;
    translatedSubtitle?: string;
    slug: string;
    [key: string]: unknown;
  }>>([]);
  
  // Search-related state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<IArticle[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const location = useLocation();

  // Fetch categories to find "why-siyar" category
  const { data: categoriesData } = useGetCategoriesQuery({ isActive: true });
  
  // Find the "why-siyar" category
  const whySiyarCategory = categoriesData?.data?.find(
    cat => cat.title.toLowerCase().replace(/\s+/g, '-') === 'why-siyar'
  );

  // Fetch articles from "why-siyar" category
  const { data: whySiyarArticlesData, isLoading } = useGetArticlesQuery({
    limit: 3,
    category: whySiyarCategory?._id,
    status: 'published',
    language: 'en'
  }, {
    // Only run the query when we have the why-siyar category ID
    skip: !whySiyarCategory?._id
  });

  // Fetch all articles for search
  const { data: allArticlesData } = useGetArticlesQuery({
    limit: 100, // Fetch more articles for better search results
    status: 'published',
    language: 'en'
  });

  // Get first 3 articles from "why-siyar" category
  const whySiyarArticles = useMemo(() => {
    return whySiyarArticlesData?.data?.items?.slice(0, 3) || [];
  }, [whySiyarArticlesData?.data?.items]);

  const isHomePage = location.pathname === "/" || location.pathname === "/about" || location.pathname === "/contact";

  const { i18n, t } = useTranslation();

  // Get all articles for search
  const allArticles = useMemo(() => {
    return allArticlesData?.data?.items || [];
  }, [allArticlesData?.data?.items]);

  // Search functionality with debouncing
  const performSearch = useCallback((query: string) => {
    if (!query.trim() || allArticles.length === 0) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    
    // Simple client-side search through article titles and subtitles
    const filteredArticles = allArticles.filter((article) => {
      const searchLower = query.toLowerCase();
      return (
        article.title.toLowerCase().includes(searchLower) ||
        article.subtitle?.toLowerCase().includes(searchLower) ||
        article.author.toLowerCase().includes(searchLower)
      );
    });

    // Sort by relevance (exact matches first, then partial matches)
    const sortedResults = filteredArticles.sort((a, b) => {
      const aTitleMatch = a.title.toLowerCase().includes(query.toLowerCase());
      const bTitleMatch = b.title.toLowerCase().includes(query.toLowerCase());
      const aSubtitleMatch = a.subtitle?.toLowerCase().includes(query.toLowerCase());
      const bSubtitleMatch = b.subtitle?.toLowerCase().includes(query.toLowerCase());
      
      // Exact title matches first
      if (aTitleMatch && !bTitleMatch) return -1;
      if (!aTitleMatch && bTitleMatch) return 1;
      
      // Then subtitle matches
      if (aSubtitleMatch && !bSubtitleMatch) return -1;
      if (!aSubtitleMatch && bSubtitleMatch) return 1;
      
      // Finally by title length (shorter titles first for better UX)
      return a.title.length - b.title.length;
    });

    setSearchResults(sortedResults.slice(0, 8)); // Limit to 8 results for better UX
    setShowSearchResults(true);
    setSelectedResultIndex(-1);
    setIsSearching(false);
  }, [allArticles]);

  // Debounced search effect
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      performSearch(searchQuery);
    }, 300); // 300ms debounce

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchQuery, performSearch]);

  // Handle search input change
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle search input key events
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSearchResults || searchResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedResultIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedResultIndex(prev => 
          prev > 0 ? prev - 1 : searchResults.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedResultIndex >= 0 && selectedResultIndex < searchResults.length) {
          const selectedArticle = searchResults[selectedResultIndex];
          setSearchOpen(false);
          setSearchQuery("");
          setShowSearchResults(false);
          // Navigate to the article
          window.location.href = `/article/${selectedArticle.slug}`;
        }
        break;
      case 'Escape':
        setShowSearchResults(false);
        setSelectedResultIndex(-1);
        break;
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
    setSelectedResultIndex(-1);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Highlight search terms in text
  const highlightSearchTerm = (text: string, searchTerm: string) => {
    if (!searchTerm.trim()) return text;
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-yellow-900 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
        setSelectedResultIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Effect to translate articles when data or language changes
  useEffect(() => {
    const translateArticles = async () => {
      if (whySiyarArticles.length > 0) {
        console.log(`🔄 Starting Why Siyar articles translation to: ${i18n.language}`);
        console.log(`📋 Articles to translate:`, whySiyarArticles.map(a => ({ title: a.title, subtitle: a.subtitle })));
        
        setIsTranslating(true);
        
        try {
          // Extract all titles and subtitles
          const allTexts = whySiyarArticles.reduce((acc, article) => {
            acc.push(article.title);
            if (article.subtitle) {
              acc.push(article.subtitle);
            }
            return acc;
          }, [] as string[]);
          
          // Use batch translation for better performance
          const currentLanguage = i18n.language as SupportedLanguage;
          
          console.log(`🌐 Translating ${allTexts.length} Why Siyar article texts to ${currentLanguage}`);
          const translatedTexts = await googleTranslationService.translateBatch(allTexts, currentLanguage);
          
          console.log(`✅ Why Siyar article translation results:`, translatedTexts);
          
          // Map translated texts back to articles
          let textIndex = 0;
          const translated = whySiyarArticles.map((article) => {
            const translatedTitle = translatedTexts[textIndex] || article.title;
            textIndex++;
            
            let translatedSubtitle = article.subtitle;
            if (article.subtitle) {
              translatedSubtitle = translatedTexts[textIndex] || article.subtitle;
              textIndex++;
            }
            
            return {
              ...article,
              translatedTitle,
              translatedSubtitle
            };
          });
          
          setTranslatedArticles(translated);
          console.log(`🎯 Why Siyar articles translation completed successfully`);
        } catch (error) {
          console.error('❌ Failed to translate Why Siyar articles:', error);
          // Fallback to original titles and subtitles
          const fallback = whySiyarArticles.map(article => ({
            ...article,
            translatedTitle: article.title,
            translatedSubtitle: article.subtitle
          }));
          setTranslatedArticles(fallback);
        } finally {
          setIsTranslating(false);
        }
      }
    };

    translateArticles();
  }, [whySiyarArticles, i18n.language]);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen || searchOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [menuOpen, searchOpen]);
  const languages: { label: string; code: string }[] = [
    { label: t('language.arabic'), code: "ar" },
    { label: t('language.english'), code: "en" },
    { label: t('language.bahasa'), code: "id" },
    { label: t('language.turkish'), code: "tr" },
  ];

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    
    // Update document direction for RTL languages
    if (language === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = language;
    }
    
    setMenuOpen(false);
  };

  // Get the appropriate logo based on current language
  const getCurrentLogo = () => {
    switch (i18n.language) {
      case 'ar':
        return arabLogo;
      case 'id':
        return indoLogo;
      case 'tr':
        return turkishLogo;
      default:
        return enLogo;
    }
  };



  const navbarClasses = `
    w-full transition-all duration-300 z-40
    ${isHomePage 
      ? (scrolled ? 'bg-[#03045E] shadow-lg' : 'bg-transparent backdrop-blur-none bg-opacity-0')
      : 'bg-[#03045E] shadow-lg'
    }
    ${isHomePage ? 'fixed top-0' : 'sticky top-0'}
  `;

  return (
    <div className={navbarClasses}>
      <div className="container mx-auto pt-10 px-5 space-y-5 py-5">
        {/* language section (desktop only) */}
        <section className="hidden md:flex md:flex-row justify-end items-center font-medium">
          <ul className="flex items-center gap-5">
            {languages.map((lang) => (
              <li
                key={lang.code}
                className={`cursor-pointer transition-colors duration-200 ${
                  i18n.language === lang.code 
                    ? "text-white" 
                    : "text-[#0054FF]"
                }`}
                onClick={() => handleLanguageChange(lang.code)}
              >
                {lang.label}
              </li>
            ))}
          </ul>
        </section>

        {/* logo and menu section */}
        <section className="flex items-center justify-between">
          <Link to="/">
            <img src={getCurrentLogo()} alt="logo" className="w-20" />
          </Link>
          <div className="flex items-center gap-5 text-white text-3xl">
            <button
              aria-label="Open search"
              className="hover:opacity-80 transition-opacity"
              onClick={() => setSearchOpen(true)}
            >
              <CiSearch />
            </button>
            <button
              aria-label="Open menu"
              className="hover:opacity-80 transition-opacity"
              onClick={() => setMenuOpen(true)}
            >
              <CiMenuFries />
            </button>
          </div>
        </section>
      </div>

      {/* Search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-[#03045E]/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-[#03045E] p-6 rounded-2xl w-full max-w-2xl mx-4 text-white relative">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold">{t('nav.search') || 'Search'}</h2>
              <button
                aria-label="Close search"
                className="text-2xl hover:opacity-80"
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery("");
                  setShowSearchResults(false);
                }}
              >
                <CiCircleRemove />
              </button>
            </div>
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                placeholder={t('nav.searchPlaceholder') || 'Search articles...'}
                value={searchQuery}
                onChange={handleSearchInputChange}
                onKeyDown={handleSearchKeyDown}
                className="w-full px-5 py-3 rounded-full bg-white/10 placeholder-white/60 border border-white/20 focus:outline-none focus:border-white/40 pr-12"
                autoFocus
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="text-white/60 hover:text-white/80 transition-colors"
                    aria-label="Clear search"
                  >
                    <FaTimes className="text-sm" />
                  </button>
                )}
                {isSearching ? (
                  <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></div>
                ) : (
                  <CiSearch className="text-2xl text-white/60" />
                )}
              </div>
            </div>

            {/* Search Results Dropdown */}
            {showSearchResults && (
              <div 
                ref={searchResultsRef}
                className="absolute top-full left-6 right-6 mt-2 bg-white rounded-xl shadow-2xl max-h-96 overflow-y-auto z-10"
              >
                {searchResults.length > 0 ? (
                  <div className="py-2">
                    {searchResults.map((article, index) => (
                      <Link
                        key={article._id}
                        to={`/article/${article.slug}`}
                        className={`block px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                          index === selectedResultIndex ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery("");
                          setShowSearchResults(false);
                        }}
                      >
                        <div className="flex items-start gap-3">
                          {article.featuredImage && (
                            <img
                              src={article.featuredImage.url}
                              alt={article.featuredImage.alt || article.title}
                              className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                              {highlightSearchTerm(article.title, searchQuery)}
                            </h3>
                            {article.subtitle && (
                              <p className="text-xs text-gray-600 line-clamp-1 mb-1">
                                {highlightSearchTerm(article.subtitle, searchQuery)}
                              </p>
                            )}
                            <p className="text-xs text-gray-500">
                              By {article.author} • {article.readTime}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : searchQuery.trim() && !isSearching ? (
                  <div className="px-4 py-8 text-center">
                    <CiSearch className="text-4xl text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">
                      No articles found for "{searchQuery}"
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      Try different keywords or check spelling
                    </p>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Burger menu drawer */}
      <div className={`fixed inset-0 z-50 transition ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-500 ${menuOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setMenuOpen(false)}
        />

        {/* Panel */}
        <aside
          className={`absolute right-0 top-0 h-full w-full sm:w-[80%] md:w-[55%] bg-[#03045E] text-white shadow-2xl transform-gpu transition-transform duration-500 ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="h-16 px-6 flex items-center justify-between border-b border-white/10">
          <div>
            <img src={getCurrentLogo()} alt="logo" className="w-32" />
          </div>
            <button
              aria-label="Close menu"
              className="text-2xl hover:opacity-80"
              onClick={() => setMenuOpen(false)}
            >
              <CiCircleRemove />
            </button>
          </div>

          <nav className="px-6 py-6">
            {/* Languages (mobile only inside drawer) */}
            <div className="md:hidden mb-8">
              <p className="text-white/70 mb-3">Languages</p>
              <ul className="space-y-4 text-lg">
                {languages.map((lang) => (
                  <li
                    key={lang.code}
                    className={`cursor-pointer transition-colors duration-200 ${
                      i18n.language === lang.code 
                        ? "text-white" 
                        : "text-[#0054FF]"
                    } hover:text-white/80`}
                    onClick={() => handleLanguageChange(lang.code)}
                  >
                    {lang.label}
                  </li>
                ))}
              </ul>
            </div>

            {/* Navigation Links */}
            <ul className="space-y-6 text-xl">
              {[
                { name: t('nav.home'), path: '/' },
                { name: t('nav.articles'), path: '/articles' },
                { name: t('nav.videos'), path: '/videos' },
                { name: t('nav.about'), path: '/about' }
              ].map((item) => (
                <li key={item.name} className="cursor-pointer hover:text-white/80" onClick={() => setMenuOpen(false)}>
                  <Link to={item.path} className="block w-full">
                    {item.name}
                  </Link>
                </li>
              ))}
              
              {/* Why Siyar with submenu */}
              <li className="relative">
                <button
                  className="flex items-center justify-between w-full hover:text-white/80 transition-colors"
                  onClick={() => setWhySiyarOpen(!whySiyarOpen)}
                >
                  <span>{t('nav.whySiyar')}</span>
                  <FaChevronDown className={`transition-transform duration-200 ${whySiyarOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Submenu */}
                {whySiyarOpen && (
                  <div className="mt-4 ml-4 space-y-4 border-l-2 border-white/20 pl-4">
                    <h4 className="text-lg font-semibold text-white/80 mb-3">{t('nav.whySiyarArticles')}</h4>
                    {isLoading || isTranslating ? (
                      // Loading state
                      <div className="space-y-3">
                        {[1, 2, 3].map((index) => (
                          <div key={index} className="animate-pulse">
                            <div className="h-4 bg-white/10 rounded mb-2"></div>
                            <div className="h-3 bg-white/5 rounded w-3/4"></div>
                          </div>
                        ))}
                      </div>
                    ) : whySiyarArticles.length > 0 ? (
                      // Articles list from "why-siyar" category
                      translatedArticles.length > 0 ? (
                        // Use translated articles
                        translatedArticles.map((article) => (
                          <div key={article._id} className="group">
                            <Link 
                              to={`/article/${article.slug}`}
                              className="block p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                              onClick={() => {
                                setWhySiyarOpen(false);
                                setMenuOpen(false);
                              }}
                            >
                              <h5 className="font-medium text-white group-hover:text-[#0054FF] transition-colors line-clamp-2">
                                {article.translatedTitle}
                              </h5>
                              {article.translatedSubtitle && (
                                <p className="text-sm text-white/70 mt-1 line-clamp-2">
                                  {article.translatedSubtitle}
                                </p>
                              )}
                            </Link>
                          </div>
                        ))
                      ) : (
                        // Fallback to original articles while translating
                        whySiyarArticles.map((article) => (
                          <div key={article._id} className="group">
                            <Link 
                              to={`/article/${article.slug}`}
                              className="block p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                              onClick={() => {
                                setWhySiyarOpen(false);
                                setMenuOpen(false);
                              }}
                            >
                              <h5 className="font-medium text-white group-hover:text-[#0054FF] transition-colors line-clamp-2">
                                {article.title}
                              </h5>
                              {article.subtitle && (
                                <p className="text-sm text-white/70 mt-1 line-clamp-2">
                                  {article.subtitle}
                                </p>
                              )}
                            </Link>
                          </div>
                        ))
                      )
                    ) : (
                      // No articles state
                      <p className="text-sm text-white/50">No Why Siyar articles available</p>
                    )}
                  </div>
                )}
              </li>
              

            </ul>
          </nav>
        </aside>
      </div>
    </div>
  );
};

export default Navbar;