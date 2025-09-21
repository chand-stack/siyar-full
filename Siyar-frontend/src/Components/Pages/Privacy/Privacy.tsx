import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import bg from '../../../assets/banner-bg.png';

const Privacy: React.FC = () => {
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-[#03045E] to-[#0054FF]">
        <div className="absolute inset-0">
          <img src={bg} alt="Background" className="w-full h-full object-cover opacity-20" />
        </div>
        <div className="relative z-10 container mx-auto px-6">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 
              className={`text-4xl md:text-6xl font-bold text-white mb-6 ${getFontClass(i18n.language)}`}
              variants={itemVariants}
            >
              {t('privacy.title')}
            </motion.h1>
            <motion.p 
              className={`text-xl text-white/90 leading-relaxed ${getFontClass(i18n.language)}`}
              variants={itemVariants}
            >
              {t('privacy.subtitle', 'Your privacy is important to us. This policy explains how we collect, use, and protect your information.')}
            </motion.p>
            <motion.p 
              className={`text-sm text-white/70 mt-4 ${getFontClass(i18n.language)}`}
              variants={itemVariants}
            >
              {t('privacy.lastUpdated', 'Last updated: January 1, 2024')}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <motion.div 
            className="max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Information Collection */}
            <motion.div className="mb-16" variants={itemVariants}>
              <h2 className={`text-3xl font-bold text-[#03045E] mb-6 ${getFontClass(i18n.language)}`}>
                {t('privacy.collection.title', 'Information We Collect')}
              </h2>
              <div className={`text-lg text-gray-700 leading-relaxed space-y-4 ${getFontClass(i18n.language)}`}>
                <p>{t('privacy.collection.description', 'We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us.')}</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>{t('privacy.collection.email', 'Email address for newsletter subscription')}</li>
                  <li>{t('privacy.collection.name', 'Name and contact information when you reach out to us')}</li>
                  <li>{t('privacy.collection.usage', 'Usage data to improve our services')}</li>
                  <li>{t('privacy.collection.cookies', 'Cookies and similar tracking technologies')}</li>
                </ul>
              </div>
            </motion.div>

            {/* How We Use Information */}
            <motion.div className="mb-16" variants={itemVariants}>
              <h2 className={`text-3xl font-bold text-[#03045E] mb-6 ${getFontClass(i18n.language)}`}>
                {t('privacy.usage.title', 'How We Use Your Information')}
              </h2>
              <div className={`text-lg text-gray-700 leading-relaxed space-y-4 ${getFontClass(i18n.language)}`}>
                <p>{t('privacy.usage.description', 'We use the information we collect to provide, maintain, and improve our services.')}</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>{t('privacy.usage.newsletter', 'Send newsletters and updates about our content')}</li>
                  <li>{t('privacy.usage.communication', 'Respond to your inquiries and provide customer support')}</li>
                  <li>{t('privacy.usage.improvement', 'Analyze usage patterns to improve our website and services')}</li>
                  <li>{t('privacy.usage.security', 'Protect against fraud and ensure security')}</li>
                </ul>
              </div>
            </motion.div>

            {/* Information Sharing */}
            <motion.div className="mb-16" variants={itemVariants}>
              <h2 className={`text-3xl font-bold text-[#03045E] mb-6 ${getFontClass(i18n.language)}`}>
                {t('privacy.sharing.title', 'Information Sharing')}
              </h2>
              <div className={`text-lg text-gray-700 leading-relaxed space-y-4 ${getFontClass(i18n.language)}`}>
                <p>{t('privacy.sharing.description', 'We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.')}</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>{t('privacy.sharing.service', 'With service providers who assist us in operating our website')}</li>
                  <li>{t('privacy.sharing.legal', 'When required by law or to protect our rights')}</li>
                  <li>{t('privacy.sharing.consent', 'With your explicit consent')}</li>
                </ul>
              </div>
            </motion.div>

            {/* Data Security */}
            <motion.div className="mb-16" variants={itemVariants}>
              <h2 className={`text-3xl font-bold text-[#03045E] mb-6 ${getFontClass(i18n.language)}`}>
                {t('privacy.security.title', 'Data Security')}
              </h2>
              <div className={`text-lg text-gray-700 leading-relaxed space-y-4 ${getFontClass(i18n.language)}`}>
                <p>{t('privacy.security.description', 'We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.')}</p>
              </div>
            </motion.div>

            {/* Children's Privacy */}
            <motion.div className="mb-16" variants={itemVariants}>
              <h2 className={`text-3xl font-bold text-[#03045E] mb-6 ${getFontClass(i18n.language)}`}>
                {t('privacy.children.title')}
              </h2>
              <div className={`text-lg text-gray-700 leading-relaxed space-y-4 ${getFontClass(i18n.language)}`}>
                <p>{t('privacy.children.description', 'Our services are not directed to children under 13. We do not knowingly collect personal information from children under 13.')}</p>
              </div>
            </motion.div>

            {/* Changes to Privacy Policy */}
            <motion.div className="mb-16" variants={itemVariants}>
              <h2 className={`text-3xl font-bold text-[#03045E] mb-6 ${getFontClass(i18n.language)}`}>
                {t('privacy.changes.title')}
              </h2>
              <div className={`text-lg text-gray-700 leading-relaxed space-y-4 ${getFontClass(i18n.language)}`}>
                <p>{t('privacy.changes.description')}</p>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div className="bg-gray-50 p-8 rounded-lg" variants={itemVariants}>
              <h2 className={`text-2xl font-bold text-[#03045E] mb-4 ${getFontClass(i18n.language)}`}>
                {t('privacy.contact.title', 'Contact Us')}
              </h2>
              <p className={`text-lg text-gray-700 leading-relaxed ${getFontClass(i18n.language)}`}>
                {t('privacy.contact.description')}
              </p>
              <div className="mt-4">
                <a 
                  href="mailto:privacy@siyar.com" 
                  className="text-[#0054FF] hover:text-[#0044CC] transition-colors font-medium"
                >
                  privacy@siyar.com
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Privacy;
