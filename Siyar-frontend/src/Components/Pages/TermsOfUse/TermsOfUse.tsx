import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import bg from '../../../assets/banner-bg.png';

const TermsOfUse: React.FC = () => {
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
              {t('termsOfUse.title')}
            </motion.h1>
            <motion.p 
              className={`text-xl text-white/90 leading-relaxed ${getFontClass(i18n.language)}`}
              variants={itemVariants}
            >
              {t('termsOfUse.subtitle')}
            </motion.p>
            <motion.p 
              className={`text-sm text-white/70 mt-4 ${getFontClass(i18n.language)}`}
              variants={itemVariants}
            >
              {t('termsOfUse.lastUpdated')}
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
            {/* Acceptance of Terms */}
            <motion.div className="mb-16" variants={itemVariants}>
              <h2 className={`text-3xl font-bold text-[#03045E] mb-6 ${getFontClass(i18n.language)}`}>
                {t('termsOfUse.acceptance.title')}
              </h2>
              <div className={`text-lg text-gray-700 leading-relaxed space-y-4 ${getFontClass(i18n.language)}`}>
                <p>{t('termsOfUse.acceptance.description')}</p>
              </div>
            </motion.div>

            {/* Use License */}
            <motion.div className="mb-16" variants={itemVariants}>
              <h2 className={`text-3xl font-bold text-[#03045E] mb-6 ${getFontClass(i18n.language)}`}>
                {t('termsOfUse.useLicense.title')}
              </h2>
              <div className={`text-lg text-gray-700 leading-relaxed space-y-4 ${getFontClass(i18n.language)}`}>
                <p>{t('termsOfUse.useLicense.description')}</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>{t('termsOfUse.useLicense.rule1')}</li>
                  <li>{t('termsOfUse.useLicense.rule2')}</li>
                  <li>{t('termsOfUse.useLicense.rule3')}</li>
                  <li>{t('termsOfUse.useLicense.rule4')}</li>
                </ul>
              </div>
            </motion.div>

            {/* User Accounts */}
            <motion.div className="mb-16" variants={itemVariants}>
              <h2 className={`text-3xl font-bold text-[#03045E] mb-6 ${getFontClass(i18n.language)}`}>
                {t('termsOfUse.userAccounts.title')}
              </h2>
              <div className={`text-lg text-gray-700 leading-relaxed space-y-4 ${getFontClass(i18n.language)}`}>
                <p>{t('termsOfUse.userAccounts.description')}</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>{t('termsOfUse.userAccounts.rule1')}</li>
                  <li>{t('termsOfUse.userAccounts.rule2')}</li>
                  <li>{t('termsOfUse.userAccounts.rule3')}</li>
                </ul>
              </div>
            </motion.div>

            {/* Prohibited Uses */}
            <motion.div className="mb-16" variants={itemVariants}>
              <h2 className={`text-3xl font-bold text-[#03045E] mb-6 ${getFontClass(i18n.language)}`}>
                {t('termsOfUse.prohibitedUses.title')}
              </h2>
              <div className={`text-lg text-gray-700 leading-relaxed space-y-4 ${getFontClass(i18n.language)}`}>
                <p>{t('termsOfUse.prohibitedUses.description')}</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>{t('termsOfUse.prohibitedUses.rule1')}</li>
                  <li>{t('termsOfUse.prohibitedUses.rule2')}</li>
                  <li>{t('termsOfUse.prohibitedUses.rule3')}</li>
                  <li>{t('termsOfUse.prohibitedUses.rule4')}</li>
                  <li>{t('termsOfUse.prohibitedUses.rule5')}</li>
                </ul>
              </div>
            </motion.div>

            {/* Content and Intellectual Property */}
            <motion.div className="mb-16" variants={itemVariants}>
              <h2 className={`text-3xl font-bold text-[#03045E] mb-6 ${getFontClass(i18n.language)}`}>
                {t('termsOfUse.contentIP.title')}
              </h2>
              <div className={`text-lg text-gray-700 leading-relaxed space-y-4 ${getFontClass(i18n.language)}`}>
                <p>{t('termsOfUse.contentIP.description')}</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>{t('termsOfUse.contentIP.rule1')}</li>
                  <li>{t('termsOfUse.contentIP.rule2')}</li>
                  <li>{t('termsOfUse.contentIP.rule3')}</li>
                </ul>
              </div>
            </motion.div>

            {/* Disclaimers */}
            <motion.div className="mb-16" variants={itemVariants}>
              <h2 className={`text-3xl font-bold text-[#03045E] mb-6 ${getFontClass(i18n.language)}`}>
                {t('termsOfUse.disclaimers.title')}
              </h2>
              <div className={`text-lg text-gray-700 leading-relaxed space-y-4 ${getFontClass(i18n.language)}`}>
                <p>{t('termsOfUse.disclaimers.description')}</p>
              </div>
            </motion.div>

            {/* Limitation of Liability */}
            <motion.div className="mb-16" variants={itemVariants}>
              <h2 className={`text-3xl font-bold text-[#03045E] mb-6 ${getFontClass(i18n.language)}`}>
                {t('termsOfUse.limitationLiability.title')}
              </h2>
              <div className={`text-lg text-gray-700 leading-relaxed space-y-4 ${getFontClass(i18n.language)}`}>
                <p>{t('termsOfUse.limitationLiability.description')}</p>
              </div>
            </motion.div>

            {/* Governing Law */}
            <motion.div className="mb-16" variants={itemVariants}>
              <h2 className={`text-3xl font-bold text-[#03045E] mb-6 ${getFontClass(i18n.language)}`}>
                {t('termsOfUse.governingLaw.title')}
              </h2>
              <div className={`text-lg text-gray-700 leading-relaxed space-y-4 ${getFontClass(i18n.language)}`}>
                <p>{t('termsOfUse.governingLaw.description')}</p>
              </div>
            </motion.div>

            {/* Changes to Terms */}
            <motion.div className="mb-16" variants={itemVariants}>
              <h2 className={`text-3xl font-bold text-[#03045E] mb-6 ${getFontClass(i18n.language)}`}>
                {t('termsOfUse.changes.title')}
              </h2>
              <div className={`text-lg text-gray-700 leading-relaxed space-y-4 ${getFontClass(i18n.language)}`}>
                <p>{t('termsOfUse.changes.description')}</p>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div className="bg-gray-50 p-8 rounded-lg" variants={itemVariants}>
              <h2 className={`text-2xl font-bold text-[#03045E] mb-4 ${getFontClass(i18n.language)}`}>
                {t('termsOfUse.contact.title')}
              </h2>
              <p className={`text-lg text-gray-700 leading-relaxed ${getFontClass(i18n.language)}`}>
                {t('termsOfUse.contact.description')}
              </p>
              <div className="mt-4">
                <a 
                  href="mailto:legal@siyar.com" 
                  className="text-[#0054FF] hover:text-[#0044CC] transition-colors font-medium"
                >
                  legal@siyar.com
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default TermsOfUse;
