
import { useTranslation } from 'react-i18next';
import { FaFacebook, FaInstagram, FaXTwitter, FaYoutube } from 'react-icons/fa6';
import { motion } from 'framer-motion';

const FollowSocialBanner = () => {
  const { t, i18n } = useTranslation();

  // Function to get font class based on language
  const getFontClass = (language: string) => {
    switch (language) {
      case 'ar': return 'font-cairo';
      case 'id': return 'font-cairo';
      case 'tr': return 'font-roboto';
      default: return 'font-cairo';
    }
  };

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
    <div className="w-full bg-[#0054FF] py-20">
      <motion.div 
        className="container mx-auto px-6 flex flex-col items-center justify-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Follow Us Text */}
        <motion.h2 
          className={`text-3xl md:text-3xl font-bold text-white uppercase tracking-wide mb-8 ${getFontClass(i18n.language)}`}
          variants={itemVariants}
        >
          {t('footer.followUs')}
        </motion.h2>

        {/* Social Media Icons */}
        <motion.div 
          className="flex items-center gap-6"
          variants={itemVariants}
        >
          {/* Facebook */}
          <a 
            href="https://www.facebook.com/profile.php?id=61579279420778" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center text-white hover:bg-white hover:text-[#03045E] transition-all duration-300"
            aria-label="Facebook"
          >
            <FaFacebook className="text-xl" />
          </a>

          {/* Instagram */}
          <a 
            href="https://www.instagram.com/siyarinstitute" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center text-white hover:bg-white hover:text-[#03045E] transition-all duration-300"
            aria-label="Instagram"
          >
            <FaInstagram className="text-xl" />
          </a>

          {/* X (Twitter) */}
          <a 
            href="https://x.com/Siyarinstitute" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center text-white hover:bg-white hover:text-[#03045E] transition-all duration-300"
            aria-label="X (Twitter)"
          >
            <FaXTwitter className="text-xl" />
          </a>

          {/* YouTube */}
          <a 
            href="http://www.youtube.com/@siyarinstitute" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center text-white hover:bg-white hover:text-[#03045E] transition-all duration-300"
            aria-label="YouTube"
          >
            <FaYoutube className="text-xl" />
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default FollowSocialBanner;