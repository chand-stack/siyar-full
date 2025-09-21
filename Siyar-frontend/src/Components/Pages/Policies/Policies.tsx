import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import bg from '../../../assets/banner-bg.png';

const Policies: React.FC = () => {
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
              {t('policies.title')}
            </motion.h1>
            <motion.p 
              className={`text-xl text-white/90 leading-relaxed ${getFontClass(i18n.language)}`}
              variants={itemVariants}
            >
              {t('policies.subtitle')}
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
            {/* Content Policy */}
            <motion.div className="mb-16" variants={itemVariants}>
              <h2 className={`text-3xl font-bold text-[#03045E] mb-6 ${getFontClass(i18n.language)}`}>
                {t('policies.contentPolicy.title')}
              </h2>
              <div className={`text-lg text-gray-700 leading-relaxed space-y-4 ${getFontClass(i18n.language)}`}>
                <p>{t('policies.contentPolicy.description')}</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>{t('policies.contentPolicy.rule1')}</li>
                  <li>{t('policies.contentPolicy.rule2')}</li>
                  <li>{t('policies.contentPolicy.rule3')}</li>
                  <li>{t('policies.contentPolicy.rule4')}</li>
                </ul>
              </div>
            </motion.div>

            {/* Community Guidelines */}
            <motion.div className="mb-16" variants={itemVariants}>
              <h2 className={`text-3xl font-bold text-[#03045E] mb-6 ${getFontClass(i18n.language)}`}>
                {t('policies.communityGuidelines.title')}
              </h2>
              <div className={`text-lg text-gray-700 leading-relaxed space-y-4 ${getFontClass(i18n.language)}`}>
                <p>{t('policies.communityGuidelines.description')}</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>{t('policies.communityGuidelines.rule1')}</li>
                  <li>{t('policies.communityGuidelines.rule2')}</li>
                  <li>{t('policies.communityGuidelines.rule3')}</li>
                  <li>{t('policies.communityGuidelines.rule4')}</li>
                </ul>
              </div>
            </motion.div>

            {/* Moderation Policy */}
            <motion.div className="mb-16" variants={itemVariants}>
              <h2 className={`text-3xl font-bold text-[#03045E] mb-6 ${getFontClass(i18n.language)}`}>
                {t('policies.moderationPolicy.title')}
              </h2>
              <div className={`text-lg text-gray-700 leading-relaxed space-y-4 ${getFontClass(i18n.language)}`}>
                <p>{t('policies.moderationPolicy.description')}</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>{t('policies.moderationPolicy.rule1')}</li>
                  <li>{t('policies.moderationPolicy.rule2')}</li>
                  <li>{t('policies.moderationPolicy.rule3')}</li>
                </ul>
              </div>
            </motion.div>

            {/* Intellectual Property */}
            <motion.div className="mb-16" variants={itemVariants}>
              <h2 className={`text-3xl font-bold text-[#03045E] mb-6 ${getFontClass(i18n.language)}`}>
                {t('policies.intellectualProperty.title')}
              </h2>
              <div className={`text-lg text-gray-700 leading-relaxed space-y-4 ${getFontClass(i18n.language)}`}>
                <p>{t('policies.intellectualProperty.description')}</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>{t('policies.intellectualProperty.rule1')}</li>
                  <li>{t('policies.intellectualProperty.rule2')}</li>
                  <li>{t('policies.intellectualProperty.rule3')}</li>
                </ul>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div className="bg-gray-50 p-8 rounded-lg" variants={itemVariants}>
              <h2 className={`text-2xl font-bold text-[#03045E] mb-4 ${getFontClass(i18n.language)}`}>
                {t('policies.contact.title')}
              </h2>
              <p className={`text-lg text-gray-700 leading-relaxed ${getFontClass(i18n.language)}`}>
                {t('policies.contact.description')}
              </p>
              <div className="mt-4">
                <a 
                  href="mailto:info@siyar.com" 
                  className="text-[#0054FF] hover:text-[#0044CC] transition-colors font-medium"
                >
                  info@siyar.com
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Policies;
