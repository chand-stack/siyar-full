import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import bg from "../../../assets/banner-bg.png";

const About: React.FC = () => {
  const { i18n } = useTranslation();
  const [activeSection, setActiveSection] = useState('what-is-siyar');

  // Refs for smooth scrolling
  const whatIsSiyarRef = useRef<HTMLDivElement>(null);
  const ourMissionRef = useRef<HTMLDivElement>(null);
  const writersRef = useRef<HTMLDivElement>(null);
  const boardMembersRef = useRef<HTMLDivElement>(null);

  // Function to handle scroll and update active section
  const handleScroll = () => {
    const scrollPosition = window.scrollY + 200; // Adjusted offset for better detection

    const whatIsSiyarTop = whatIsSiyarRef.current?.offsetTop || 0;
    const ourMissionTop = ourMissionRef.current?.offsetTop || 0;
    const writersTop = writersRef.current?.offsetTop || 0;
    const boardMembersTop = boardMembersRef.current?.offsetTop || 0;

    let newActiveSection = 'what-is-siyar'; // Default

    // Check which section is currently in view
    if (scrollPosition >= boardMembersTop) {
      newActiveSection = 'board-members';
    } else if (scrollPosition >= writersTop) {
      newActiveSection = 'writers';
    } else if (scrollPosition >= ourMissionTop) {
      newActiveSection = 'our-mission';
    } else if (scrollPosition >= whatIsSiyarTop) {
      newActiveSection = 'what-is-siyar';
    }

    // Always update to ensure it works
    setActiveSection(newActiveSection);
  };

  // Function to get font class based on language
  const getFontClass = (language: string) => {
    switch (language) {
      case 'ar': return 'font-cairo';
      case 'id': return 'font-cairo';
      case 'tr': return 'font-roboto';
      default: return 'font-cairo';
    }
  };

  // Function to scroll to section
  const scrollToSection = (sectionId: string, ref: React.RefObject<HTMLDivElement | null>) => {
    setActiveSection(sectionId);
    if (ref.current) {
      const elementTop = ref.current.offsetTop;
      const offset = 120; // Simple offset for navbar and spacing
      window.scrollTo({
        top: elementTop - offset,
        behavior: 'smooth'
      });
    }
  };

  // Add scroll event listener
  React.useEffect(() => {
    const handleScrollEvent = () => {
      handleScroll();
    };

    window.addEventListener('scroll', handleScrollEvent, { passive: true });
    // Initial call to set active section on page load
    handleScroll();
    return () => window.removeEventListener('scroll', handleScrollEvent);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Banner Section */}
      <div
        className="w-full min-h-[20vh] bg-[#03045E]"
        style={{
          backgroundImage: `url('${bg}')`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
          width: "100%"
        }}
      ></div>

      {/* Main Content */}
      <div className=" px-6 py-16">
        <motion.div 
          className="max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Page Title */}
          <motion.h1 
            className={`text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-12 ${getFontClass(i18n.language)}`}
            variants={itemVariants}
          >
            About US
          </motion.h1>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Main Content - Left Side (3 columns) */}
            <div className="lg:col-span-3 space-y-16">
              
              {/* What is Siyar Section */}
              <motion.div ref={whatIsSiyarRef} variants={itemVariants}>
                <h2 className={`text-2xl md:text-3xl font-bold text-[#03045E] mb-6 ${getFontClass(i18n.language)}`}>
                  WHAT IS SIYAR?
                </h2>
                <p className={`text-lg text-gray-700 leading-relaxed ${getFontClass(i18n.language)}`}>
                  Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
                </p>
              </motion.div>

              {/* Our Mission Section */}
              <motion.div ref={ourMissionRef} variants={itemVariants}>
                <h2 className={`text-2xl md:text-3xl font-bold text-[#03045E] mb-6 ${getFontClass(i18n.language)}`}>
                  OUR MISSION
                </h2>
                <p className={`text-lg text-gray-700 leading-relaxed ${getFontClass(i18n.language)}`}>
                  Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
                </p>
              </motion.div>



              {/* Writers Section */}
              <motion.div ref={writersRef} variants={itemVariants}>
                <h2 className={`text-2xl md:text-3xl font-bold text-[#03045E] mb-8 ${getFontClass(i18n.language)}`}>
                  WRITERS
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-16 h-16 rounded-full bg-gray-300 flex-shrink-0"></div>
                      <div>
                        <h3 className={`font-bold text-[#03045E] text-lg ${getFontClass(i18n.language)}`}>
                          DR. REZA PANKHURST
                        </h3>
                        <p className={`text-sm text-gray-600 mt-2 ${getFontClass(i18n.language)}`}>
                          Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Board Members Section */}
              <motion.div ref={boardMembersRef} variants={itemVariants}>
                <div className="w-full h-px bg-[#03045E] mb-8"></div>
                <h2 className={`text-2xl md:text-3xl font-bold text-[#03045E] mb-8 ${getFontClass(i18n.language)}`}>
                  BOARD MEMBERS
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {[1, 2].map((index) => (
                    <div key={index} className="space-y-4">
                      <div className="w-full h-64 bg-gray-300 rounded-lg"></div>
                      <h3 className={`font-bold text-[#03045E] text-xl ${getFontClass(i18n.language)}`}>
                        DR. REZA PANKHURST
                      </h3>
                      <p className={`text-gray-700 leading-relaxed ${getFontClass(i18n.language)}`}>
                        Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Navigation Sidebar - Right Side (1 column) */}
            <motion.div className="lg:col-span-1" variants={itemVariants}>
              <div className="sticky top-24 space-y-4">
                <h3 className={`text-lg font-semibold text-gray-800 mb-4 ${getFontClass(i18n.language)}`}>
                  Navigation
                </h3>
                <ul className="space-y-3">
                  <li>
                    <button
                      onClick={() => scrollToSection('what-is-siyar', whatIsSiyarRef)}
                      className={`text-left transition-colors duration-200 ${getFontClass(i18n.language)} ${
                        activeSection === 'what-is-siyar' 
                          ? 'text-[#0054FF] font-semibold' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      WHAT IS SIYAR?
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection('our-mission', ourMissionRef)}
                      className={`text-left transition-colors duration-200 ${getFontClass(i18n.language)} ${
                        activeSection === 'our-mission' 
                          ? 'text-[#0054FF] font-semibold' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      OUR MISSION
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection('writers', writersRef)}
                      className={`text-left transition-colors duration-200 ${getFontClass(i18n.language)} ${
                        activeSection === 'writers' 
                          ? 'text-[#0054FF] font-semibold' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      WRITERS
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection('board-members', boardMembersRef)}
                      className={`text-left transition-colors duration-200 ${getFontClass(i18n.language)} ${
                        activeSection === 'board-members' 
                          ? 'text-[#0054FF] font-semibold' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      BOARD MEMBERS
                    </button>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Full Width Statistics Banner */}
      <motion.div 
        className="w-full bg-blue-100 py-16"
        variants={itemVariants}
      >
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {/* Global Team */}
            <div className="space-y-2">
              <h3 className={`text-5xl md:text-6xl font-bold text-[#0054FF] ${getFontClass(i18n.language)}`}>
                54
              </h3>
              <p className={`text-lg font-semibold text-[#03045E] uppercase tracking-wide ${getFontClass(i18n.language)}`}>
                Global Team
              </p>
            </div>

            {/* Subscribers */}
            <div className="space-y-2">
              <h3 className={`text-5xl md:text-6xl font-bold text-[#0054FF] ${getFontClass(i18n.language)}`}>
                2,500
              </h3>
              <p className={`text-lg font-semibold text-[#03045E] uppercase tracking-wide ${getFontClass(i18n.language)}`}>
                Subscribers
              </p>
            </div>

            {/* Articles */}
            <div className="space-y-2">
              <h3 className={`text-5xl md:text-6xl font-bold text-[#0054FF] ${getFontClass(i18n.language)}`}>
                700+
              </h3>
              <p className={`text-lg font-semibold text-[#03045E] uppercase tracking-wide ${getFontClass(i18n.language)}`}>
                Articles
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
