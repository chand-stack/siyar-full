import React from 'react';
import type { IArticle } from '../../../../Redux/api/articleApi';
import { FaTimes, FaGlobe, FaStar, FaClock } from 'react-icons/fa';

interface ViewArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  article?: IArticle;
}

const ViewArticleModal: React.FC<ViewArticleModalProps> = ({ isOpen, onClose, article }) => {
  if (!isOpen || !article) return null;

  const languageLabel: Record<string, string> = {
    en: 'English',
    ar: 'Arabic',
    id: 'Indonesian',
    tr: 'Turkish'
  };

  // Get font class based on article language
  const getLanguageFontClass = (language: string) => {
    switch (language) {
      case 'ar':
        return 'font-cairo Cairo-Regular'; // Arabic font
      case 'id':
        return 'font-cairo Cairo-Regular'; // Indonesian using Arabic font
      case 'tr':
        return 'font-roboto font-roboto-regular'; // Turkish using Roboto
      default:
        return 'font-roboto font-roboto-regular'; // English and others using Roboto
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary-focus text-primary-content p-6">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold">{article.title}</h2>
              {article.subtitle && (
                <p className="opacity-90">{article.subtitle}</p>
              )}
            </div>
            <button onClick={onClose} className="btn btn-ghost btn-circle text-primary-content hover:bg-primary-focus">
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(95vh-96px)] space-y-6">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="badge badge-outline flex items-center gap-1">
              <FaGlobe /> {languageLabel[article.language] || article.language}
            </span>
            <span className="badge badge-outline">Status: {article.status}</span>
            {article.isFeatured && (
              <span className="badge badge-primary flex items-center gap-1">
                <FaStar /> Featured
              </span>
            )}
            {article.isLatest && (
              <span className="badge badge-secondary flex items-center gap-1">
                <FaClock /> Latest
              </span>
            )}
            <span className="badge badge-outline">Author: {article.author}</span>
            {article.publishedAt && (
              <span className="badge badge-outline">Published: {new Date(article.publishedAt).toLocaleDateString()}</span>
            )}
          </div>

          {article.featuredImage?.url && (
            <div className="w-full">
              <img
                src={article.featuredImage.url}
                alt={article.featuredImage.alt || 'Featured'}
                className="w-full max-h-96 object-cover rounded-xl"
              />
              {article.featuredImage.caption && (
                <p className="text-center text-xs mt-2 opacity-70">{article.featuredImage.caption}</p>
              )}
            </div>
          )}

          <div className={`prose max-w-none ${getLanguageFontClass(article.language)}`}>
            {article.content?.html ? (
              <div 
                className="article-content"
                dangerouslySetInnerHTML={{ __html: article.content.html }} 
              />
            ) : (
              <p className="opacity-70">No content available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewArticleModal;


