import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { 
  useCreateArticleMutation, 
  useUpdateArticleMutation,
  useCreateDualLanguageArticleMutation,
  useUpdateDualLanguageArticleMutation
  // Note: These mutations are available for future use if needed
  // useAddArabicVersionMutation,
  // useAddArabicAuthorTitleSubtitleMutation,
  // useUpdateDualLanguageFieldsMutation
} from '../../../../Redux/api/articleApi';
import { useGetCategoriesQuery } from '../../../../Redux/api/categoryApi';
import { useGetSeriesQuery } from '../../../../Redux/api/seriesApi';
import type { SupportedLanguage, ArticleStatus, IArticle } from '../../../../Redux/api/articleApi';
import { FaTimes, FaSave, FaImage, FaTags, FaGlobe, FaClock, FaStar, FaNewspaper, FaEdit, FaInfoCircle, FaFolder, FaBook, FaLanguage } from 'react-icons/fa';
import JoditEditor from 'jodit-react';
import Swal from 'sweetalert2';

interface ArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode: 'create' | 'edit';
  article?: IArticle; // For edit mode
}

const ArticleModal: React.FC<ArticleModalProps> = ({ isOpen, onClose, onSuccess, mode, article }) => {
  const [createArticle, { isLoading: isCreating }] = useCreateArticleMutation();
  const [updateArticle, { isLoading: isUpdating }] = useUpdateArticleMutation();
  const [createDualLanguageArticle, { isLoading: isCreatingDual }] = useCreateDualLanguageArticleMutation();
  const [updateDualLanguageArticle, { isLoading: isUpdatingDual }] = useUpdateDualLanguageArticleMutation();
  
  // Debug logging
  console.log('ArticleModal rendered - mode:', mode, 'isOpen:', isOpen);
  // Note: These mutations are available for future use if needed
  // const [addArabicVersion, { isLoading: isAddingArabic }] = useAddArabicVersionMutation();
  // const [addArabicAuthorTitleSubtitle, { isLoading: isAddingArabicFields }] = useAddArabicAuthorTitleSubtitleMutation();
  // const [updateDualLanguageFields, { isLoading: isUpdatingDualFields }] = useUpdateDualLanguageFieldsMutation();
  
  // Fetch categories and series for selection
  const { data: categoriesResponse } = useGetCategoriesQuery({});
  const { data: seriesResponse } = useGetSeriesQuery({});
  
  // State for managing dual-language mode
  const [isDualLanguageMode, setIsDualLanguageMode] = useState(false);
  const [activeLanguageTab, setActiveLanguageTab] = useState<'en' | 'ar'>('en');
  const [arabicKeywordsInput, setArabicKeywordsInput] = useState('');
  const [localArabicContent, setLocalArabicContent] = useState('');
  
  // Debug logging for dual-language state
  console.log('isDualLanguageMode state:', isDualLanguageMode);
  
  const [formData, setFormData] = useState({
    slug: '',
    language: 'en' as SupportedLanguage,
    title: '',
    subtitle: '',
    excerpt: '',
    author: '',
    readTime: '',
    content: {
      html: '',
      plainText: '',
      wordCount: 0
    },
    featuredImage: {
      url: '',
      alt: '',
      caption: ''
    },
    categories: [] as string[],
    series: undefined as { id: string; order: number } | undefined,
    meta: {
      description: '',
      keywords: [] as string[],
      ogImage: ''
    },
    status: 'draft' as ArticleStatus,
    isFeatured: false,
    isLatest: false,
    // Dual-language support fields
    dualLanguageAuthor: {
      en: '',
      ar: ''
    },
    dualLanguageTitle: {
      en: '',
      ar: ''
    },
    dualLanguageSubtitle: {
      en: '',
      ar: ''
    },
    dualLanguage: {
      en: {
        title: '',
        subtitle: '',
        excerpt: '',
        content: {
          html: '',
          plainText: '',
          wordCount: 0
        },
        featuredImage: {
          url: '',
          alt: '',
          caption: ''
        },
        meta: {
          description: '',
          keywords: [] as string[],
          ogImage: ''
        },
        readTime: '',
        status: 'draft' as ArticleStatus
      },
      ar: {
        title: '',
        subtitle: '',
        excerpt: '',
        content: {
          html: '',
          plainText: '',
          wordCount: 0
        },
        featuredImage: {
          url: '',
          alt: '',
          caption: ''
        },
        meta: {
          description: '',
          keywords: [] as string[],
          ogImage: ''
        },
        readTime: '',
        status: 'draft' as ArticleStatus
      }
    }
  });

  const [keywordsInput, setKeywordsInput] = useState('');
  const [localContent, setLocalContent] = useState(formData.content.html);

  // Initialize form data when article changes (for edit mode)
  useEffect(() => {
    if (article && mode === 'edit') {
      // Check if article has dual-language content
      const hasDualLanguage = article.dualLanguage?.en || article.dualLanguage?.ar || 
                             article.dualLanguageAuthor?.en || article.dualLanguageAuthor?.ar ||
                             article.dualLanguageTitle?.en || article.dualLanguageTitle?.ar ||
                             article.dualLanguageSubtitle?.en || article.dualLanguageSubtitle?.ar;
      
      setIsDualLanguageMode(!!hasDualLanguage);
      
      setFormData({
        slug: article.slug || '',
        language: article.language || 'en',
        title: article.title || '',
        subtitle: article.subtitle || '',
        excerpt: article.excerpt || '',
        author: article.author || '',
        readTime: article.readTime || '',
        content: {
          html: article.content?.html || '',
          plainText: article.content?.plainText || '',
          wordCount: article.content?.wordCount || 0
        },
        featuredImage: {
          url: article.featuredImage?.url || '',
          alt: article.featuredImage?.alt || '',
          caption: article.featuredImage?.caption || ''
        },
        categories: article.categories || [],
        series: article.series || undefined,
        meta: {
          description: article.meta?.description || '',
          keywords: article.meta?.keywords || [],
          ogImage: article.meta?.ogImage || ''
        },
        status: article.status || 'draft',
        isFeatured: article.isFeatured || false,
        isLatest: article.isLatest || false,
        // Dual-language fields
        dualLanguageAuthor: {
          en: article.dualLanguageAuthor?.en || '',
          ar: article.dualLanguageAuthor?.ar || ''
        },
        dualLanguageTitle: {
          en: article.dualLanguageTitle?.en || '',
          ar: article.dualLanguageTitle?.ar || ''
        },
        dualLanguageSubtitle: {
          en: article.dualLanguageSubtitle?.en || '',
          ar: article.dualLanguageSubtitle?.ar || ''
        },
        dualLanguage: {
          en: {
            title: article.dualLanguage?.en?.title || '',
            subtitle: article.dualLanguage?.en?.subtitle || '',
            excerpt: article.dualLanguage?.en?.excerpt || '',
            content: {
              html: article.dualLanguage?.en?.content?.html || '',
              plainText: article.dualLanguage?.en?.content?.plainText || '',
              wordCount: article.dualLanguage?.en?.content?.wordCount || 0
            },
            featuredImage: {
              url: article.dualLanguage?.en?.featuredImage?.url || '',
              alt: article.dualLanguage?.en?.featuredImage?.alt || '',
              caption: article.dualLanguage?.en?.featuredImage?.caption || ''
            },
            meta: {
              description: article.dualLanguage?.en?.meta?.description || '',
              keywords: article.dualLanguage?.en?.meta?.keywords || [],
              ogImage: article.dualLanguage?.en?.meta?.ogImage || ''
            },
            readTime: article.dualLanguage?.en?.readTime || '',
            status: article.dualLanguage?.en?.status || 'draft'
          },
          ar: {
            title: article.dualLanguage?.ar?.title || '',
            subtitle: article.dualLanguage?.ar?.subtitle || '',
            excerpt: article.dualLanguage?.ar?.excerpt || '',
            content: {
              html: article.dualLanguage?.ar?.content?.html || '',
              plainText: article.dualLanguage?.ar?.content?.plainText || '',
              wordCount: article.dualLanguage?.ar?.content?.wordCount || 0
            },
            featuredImage: {
              url: article.dualLanguage?.ar?.featuredImage?.url || '',
              alt: article.dualLanguage?.ar?.featuredImage?.alt || '',
              caption: article.dualLanguage?.ar?.featuredImage?.caption || ''
            },
            meta: {
              description: article.dualLanguage?.ar?.meta?.description || '',
              keywords: article.dualLanguage?.ar?.meta?.keywords || [],
              ogImage: article.dualLanguage?.ar?.meta?.ogImage || ''
            },
            readTime: article.dualLanguage?.ar?.readTime || '',
            status: article.dualLanguage?.ar?.status || 'draft'
          }
        }
      });
      
      // Set keywords input
      setKeywordsInput(article.meta?.keywords?.join(', ') || '');
      setLocalContent(article.content?.html || '');
      setArabicKeywordsInput(article.dualLanguage?.ar?.meta?.keywords?.join(', ') || '');
      setLocalArabicContent(article.dualLanguage?.ar?.content?.html || '');
    } else {
      // Reset form for create mode
      setFormData({
        slug: '',
        language: 'en',
        title: '',
        subtitle: '',
        excerpt: '',
        author: '',
        readTime: '',
        content: { html: '', plainText: '', wordCount: 0 },
        featuredImage: { url: '', alt: '', caption: '' },
        categories: [],
        series: undefined,
        meta: { description: '', keywords: [], ogImage: '' },
        status: 'draft',
        isFeatured: false,
        isLatest: false,
        dualLanguageAuthor: { en: '', ar: '' },
        dualLanguageTitle: { en: '', ar: '' },
        dualLanguageSubtitle: { en: '', ar: '' },
        dualLanguage: {
          en: {
            title: '',
            subtitle: '',
            excerpt: '',
            content: { html: '', plainText: '', wordCount: 0 },
            featuredImage: { url: '', alt: '', caption: '' },
            meta: { description: '', keywords: [], ogImage: '' },
            readTime: '',
            status: 'draft'
          },
          ar: {
            title: '',
            subtitle: '',
            excerpt: '',
            content: { html: '', plainText: '', wordCount: 0 },
            featuredImage: { url: '', alt: '', caption: '' },
            meta: { description: '', keywords: [], ogImage: '' },
            readTime: '',
            status: 'draft'
          }
        }
      });
      setKeywordsInput('');
      setLocalContent('');
      setArabicKeywordsInput('');
      setLocalArabicContent('');
      setIsDualLanguageMode(false);
      setActiveLanguageTab('en');
    }
  }, [article, mode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as Record<string, unknown>),
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  // Debounced content change handler to prevent editor from getting stuck
  const contentChangeTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const arabicContentChangeTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  
  const handleContentChange = useCallback((content: string) => {
    // Update local content immediately for responsive UI
    setLocalContent(content);
    
    // Clear previous timeout
    if (contentChangeTimeoutRef.current) {
      clearTimeout(contentChangeTimeoutRef.current);
    }
    
    // Debounce the content update to prevent excessive re-renders
    contentChangeTimeoutRef.current = setTimeout(() => {
      // Extract plain text from HTML for word count
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      const plainText = tempDiv.textContent || tempDiv.innerText || '';
      const wordCount = plainText.trim().split(/\s+/).filter(word => word.length > 0).length;

      setFormData(prev => ({
        ...prev,
        content: {
          html: content,
          plainText,
          wordCount
        }
      }));
    }, 300); // 300ms debounce
  }, []);

  const handleArabicContentChange = useCallback((content: string) => {
    // Update local Arabic content immediately for responsive UI
    setLocalArabicContent(content);
    
    // Clear previous timeout
    if (arabicContentChangeTimeoutRef.current) {
      clearTimeout(arabicContentChangeTimeoutRef.current);
    }
    
    // Debounce the content update to prevent excessive re-renders
    arabicContentChangeTimeoutRef.current = setTimeout(() => {
      // Extract plain text from HTML for word count
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      const plainText = tempDiv.textContent || tempDiv.innerText || '';
      const wordCount = plainText.trim().split(/\s+/).filter(word => word.length > 0).length;

      setFormData(prev => ({
        ...prev,
        dualLanguage: {
          ...prev.dualLanguage,
          ar: {
            ...prev.dualLanguage.ar,
            content: {
              html: content,
              plainText,
              wordCount
            }
          }
        }
      }));
    }, 300); // 300ms debounce
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (contentChangeTimeoutRef.current) {
        clearTimeout(contentChangeTimeoutRef.current);
      }
    };
  }, []);

  // Sync local content when form data changes (e.g., language switch)
  useEffect(() => {
    setLocalContent(formData.content.html);
  }, [formData.content.html]);

  // Get default font based on language
  const getDefaultFont = (language: SupportedLanguage) => {
    switch (language) {
      case 'ar':
        return 'Cairo-Regular, Arial, sans-serif';
      case 'id':
        return 'Cairo-Regular, Arial, sans-serif';
      case 'tr':
        return 'RobotoCondensedRegular, Arial, sans-serif';
      default: // 'en' and others
        return 'RobotoCondensedRegular, Arial, sans-serif';
    }
  };

  // Memoize Jodit editor config to prevent unnecessary re-renders
  const joditConfig = useMemo(() => ({
    height: 400,
    theme: 'default',
    toolbar: true,
    spellcheck: true,
    language: 'en',
    // Add custom CSS to load fonts in editor iframe
    extraCSS: `
      @import url('/src/index.css');
      
      /* Set default font based on article language */
      body, .jodit-wysiwyg, .jodit-wysiwyg * {
        font-family: ${getDefaultFont(formData.language)} !important;
      }
      
      /* Specific font classes for manual selection */
      .font-roboto-bold { font-family: 'RobotoCondensedBold', Arial, sans-serif !important; }
      .font-roboto-italic { font-family: 'RobotoCondensedItalic', Arial, sans-serif !important; }
      .font-roboto-regular { font-family: 'RobotoCondensedRegular', Arial, sans-serif !important; }
      .cairo-black { font-family: 'Cairo-Black', Arial, sans-serif !important; }
      .cairo-bold { font-family: 'Cairo-Bold', Arial, sans-serif !important; }
      .cairo-extrabold { font-family: 'Cairo-ExtraBold', Arial, sans-serif !important; }
      .cairo-extralight { font-family: 'Cairo-ExtraLight', Arial, sans-serif !important; }
      .cairo-light { font-family: 'Cairo-Light', Arial, sans-serif !important; }
      .cairo-medium { font-family: 'Cairo-Medium', Arial, sans-serif !important; }
      .cairo-regular { font-family: 'Cairo-Regular', Arial, sans-serif !important; }
      .cairo-semibold { font-family: 'Cairo-SemiBold', Arial, sans-serif !important; }
      
      /* RTL support for Arabic */
      ${formData.language === 'ar' ? `
        body, .jodit-wysiwyg {
          direction: rtl;
          text-align: right;
        }
      ` : ''}
    `,
    uploader: {
      insertImageAsBase64URI: true,
      url: '/upload',
      format: 'json',
      headers: {
        'X-CSRF-TOKEN': 'request'
      },
      filesVariableName: 'files',
      withCredentials: false,
      pathVariableName: 'path',
      method: 'POST'
    },
    // Enhanced button configuration with comprehensive formatting options
    buttons: [
      'source', 'fullsize', '|',
      'bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript', '|',
      'font', 'fontsize', 'brush', 'paragraph', '|',
      'ul', 'ol', 'outdent', 'indent', '|',
      'left', 'center', 'right', 'justify', '|',
      'forecolor', 'backcolor', '|',
      'image', 'video', 'link', 'table', '|',
      'hr', 'symbol', 'copyformat', 'selectall', '|',
      'undo', 'redo', '|',
      'find', 'replace', '|',
      'print', 'about'
    ],
    // Medium devices (tablets)
    buttonsMD: [
      'source', 'fullsize', '|',
      'bold', 'italic', 'underline', 'strikethrough', '|',
      'font', 'fontsize', 'brush', '|',
      'ul', 'ol', 'outdent', 'indent', '|',
      'left', 'center', 'right', 'justify', '|',
      'forecolor', 'backcolor', '|',
      'image', 'link', 'table', '|',
      'undo', 'redo'
    ],
    // Small devices (phones landscape)
    buttonsSM: [
      'bold', 'italic', 'underline', '|',
      'font', 'fontsize', '|',
      'ul', 'ol', '|',
      'left', 'center', 'right', '|',
      'forecolor', 'backcolor', '|',
      'image', 'link', '|',
      'undo', 'redo'
    ],
    // Extra small devices (phones portrait)
    buttonsXS: [
      'bold', 'italic', '|',
      'font', 'fontsize', '|',
      'ul', 'ol', '|',
      'left', 'center', 'right', '|',
      'image', 'link'
    ],
    // Font and size lists
    fontSizeList: ['8', '9', '10', '11', '12', '14', '16', '18', '20', '22', '24', '26', '28', '36', '48', '72'],
    fontList: {
      // Default system fonts
      'Arial': 'Arial, Helvetica, sans-serif',
      'Arial Black': 'Arial Black, Gadget, sans-serif',
      'Comic Sans MS': 'Comic Sans MS, cursive',
      'Courier New': 'Courier New, Courier, monospace',
      'Georgia': 'Georgia, serif',
      'Helvetica': 'Helvetica, Arial, sans-serif',
      'Impact': 'Impact, Charcoal, sans-serif',
      'Lucida Console': 'Lucida Console, Monaco, monospace',
      'Lucida Sans Unicode': 'Lucida Sans Unicode, Lucida Grande, sans-serif',
      'Palatino Linotype': 'Palatino Linotype, Book Antiqua, Palatino, serif',
      'Tahoma': 'Tahoma, Geneva, sans-serif',
      'Times New Roman': 'Times New Roman, Times, serif',
      'Trebuchet MS': 'Trebuchet MS, Helvetica, sans-serif',
      'Verdana': 'Verdana, Geneva, sans-serif',
      
      // Custom Roboto fonts
      'Roboto Condensed Bold': 'RobotoCondensedBold, Arial, sans-serif',
      'Roboto Condensed Italic': 'RobotoCondensedItalic, Arial, sans-serif',
      'Roboto Condensed Regular': 'RobotoCondensedRegular, Arial, sans-serif',
      
      // Custom Cairo fonts (Arabic support)
      'Cairo Black': 'Cairo-Black, Arial, sans-serif',
      'Cairo Bold': 'Cairo-Bold, Arial, sans-serif',
      'Cairo Extra Bold': 'Cairo-ExtraBold, Arial, sans-serif',
      'Cairo Extra Light': 'Cairo-ExtraLight, Arial, sans-serif',
      'Cairo Light': 'Cairo-Light, Arial, sans-serif',
      'Cairo Medium': 'Cairo-Medium, Arial, sans-serif',
      'Cairo Regular': 'Cairo-Regular, Arial, sans-serif',
      'Cairo Semi Bold': 'Cairo-SemiBold, Arial, sans-serif'
    },
    // Text alignment options
    textAlign: {
      left: true,
      center: true,
      right: true,
      justify: true
    },
    // Color configuration for text and background
    colors: {
      greyscale: ['#000000', '#434343', '#666666', '#999999', '#B7B7B7', '#CCCCCC', '#D9D9D9', '#EFEFEF', '#F3F3F3', '#FFFFFF'],
      palette: [
        '#FF0000', '#FF9900', '#FFFF00', '#00FF00', '#00FFFF', '#0099FF', '#0000FF', '#9900FF', '#FF00FF',
        '#F4CCCC', '#FCE5CD', '#FFF2CC', '#D9EAD3', '#D0E0E3', '#C9DAF8', '#CFE2F3', '#D9D2E9', '#EAD1DC',
        '#EA9999', '#F9CB9C', '#FFE599', '#B6D7A8', '#A2C4C9', '#A4C2F4', '#9FC5E8', '#B4A7D6', '#D5A6BD',
        '#E06666', '#F6B26B', '#FFD966', '#93C47D', '#76A5AF', '#6D9EEB', '#6FA8DC', '#8E7CC3', '#C27BA0',
        '#CC0000', '#E69138', '#F1C232', '#6AA84F', '#45818E', '#3C78D8', '#3D85C6', '#674EA7', '#A64D79',
        '#990000', '#B45F06', '#BF9000', '#38761D', '#134F5C', '#1155CC', '#0B5394', '#351C75', '#741B47',
        '#660000', '#783F04', '#7F6000', '#274E13', '#0C343D', '#1C4587', '#073763', '#20124D', '#4C1130'
      ]
    },
    // Enable color picker
    colorPickerDefaultTab: 'background' as const,
    // Link configuration
    link: {
      followOnDblClick: false,
      processVideoLink: true,
      processPastedLink: true,
      openLinkDialogAfterPost: true,
      removeLinkAfterFormat: true
    },
    // Image configuration
    image: {
      openOnDblClick: true,
      editSrc: true,
      useImageEditor: true,
      editTitle: true,
      editAlt: true,
      editLink: true,
      editSize: true,
      editBorderRadius: true,
      editMargins: true,
      editClass: true,
      editStyle: true,
      editId: true,
      editAlign: true,
      showPreview: true,
      selectImageAfterClose: true
    },
    // Performance optimizations
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    processPastedHTML: true,
    // Editor features
    showCharsCounter: true,
    showWordsCounter: true,
    showXPathInStatusbar: false,
    statusbar: true,
    // Better focus handling
    focus: false,
    // Enable advanced features
    allowResizeY: true,
    allowResizeX: false,
    minHeight: 300,
    maxHeight: 800,
    // Paste options - removed defaultActionOnPaste due to type compatibility
    // Tab behavior - removed tab property due to type compatibility
    // Enable plugins
    extraPlugins: ['about'],
    // Disable some features that might interfere
    readonly: false,
    disabled: false,
    // Advanced text formatting
    beautifyHTML: true,
    cleanHTML: {
      fillEmptyParagraph: false,
      removeEmptyElements: false,
      replaceNBSP: false,
      removeOnlySelection: false
    }
  }), [formData.language]);

  const handleKeywordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeywordsInput(e.target.value);
    const keywords = e.target.value.split(',').map(k => k.trim()).filter(Boolean);
    setFormData(prev => ({
      ...prev,
      meta: {
        ...prev.meta,
        keywords
      }
    }));
  };

  const handleArabicKeywordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArabicKeywordsInput(e.target.value);
    const keywords = e.target.value.split(',').map(k => k.trim()).filter(Boolean);
    setFormData(prev => ({
      ...prev,
      dualLanguage: {
        ...prev.dualLanguage,
        ar: {
          ...prev.dualLanguage.ar,
          meta: {
            ...prev.dualLanguage.ar.meta,
            keywords
          }
        }
      }
    }));
  };

  const handleDualLanguageInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, language: 'en' | 'ar', field: string) => {
    const { value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        dualLanguage: {
          ...prev.dualLanguage,
          [language]: {
            ...prev.dualLanguage[language],
            [parent]: {
              ...(prev.dualLanguage[language][parent as keyof typeof prev.dualLanguage[typeof language]] as Record<string, unknown>),
              [child]: type === 'checkbox' ? checked : value
            }
          }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        dualLanguage: {
          ...prev.dualLanguage,
          [language]: {
            ...prev.dualLanguage[language],
            [field]: type === 'checkbox' ? checked : value
          }
        }
      }));
    }
  };

  // Note: This handler is available for future use if needed
  // const handleDualLanguageAuthorTitleSubtitleChange = (e: React.ChangeEvent<HTMLInputElement>, language: 'en' | 'ar', field: 'author' | 'title' | 'subtitle') => {
  //   const { value } = e.target;
  //   setFormData(prev => ({
  //     ...prev,
  //     [`dualLanguage${field.charAt(0).toUpperCase() + field.slice(1)}`]: {
  //       ...prev[`dualLanguage${field.charAt(0).toUpperCase() + field.slice(1)}` as keyof typeof prev] as Record<string, string>,
  //       [language]: value
  //     }
  //   }));
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (mode === 'create') {
        if (isDualLanguageMode) {
          // Create dual-language article
          await createDualLanguageArticle(formData).unwrap();
        } else {
          // Create regular article
          await createArticle(formData).unwrap();
        }
        
        // Show success message
        await Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: `Article ${isDualLanguageMode ? 'with dual-language support ' : ''}created successfully`,
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        // Edit mode
        if (!article?._id) {
          throw new Error('Article ID is required for editing');
        }
        
        if (isDualLanguageMode) {
          // Update dual-language article
          await updateDualLanguageArticle({
            id: article._id,
            data: formData
          }).unwrap();
        } else {
          // Update regular article
          await updateArticle({
            id: article._id,
            data: formData
          }).unwrap();
        }
        
        // Show success message
        await Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: `Article ${isDualLanguageMode ? 'with dual-language support ' : ''}updated successfully`,
          timer: 2000,
          showConfirmButton: false
        });
      }
      
      onSuccess();
      onClose();
      
      // Reset form only for create mode
      if (mode === 'create') {
        setFormData({
          slug: '',
          language: 'en',
          title: '',
          subtitle: '',
          excerpt: '',
          author: '',
          readTime: '',
          content: { html: '', plainText: '', wordCount: 0 },
          featuredImage: { url: '', alt: '', caption: '' },
          categories: [],
          series: undefined,
          meta: { description: '', keywords: [], ogImage: '' },
          status: 'draft',
          isFeatured: false,
          isLatest: false,
          dualLanguageAuthor: { en: '', ar: '' },
          dualLanguageTitle: { en: '', ar: '' },
          dualLanguageSubtitle: { en: '', ar: '' },
          dualLanguage: {
            en: {
              title: '',
              subtitle: '',
              excerpt: '',
              content: { html: '', plainText: '', wordCount: 0 },
              featuredImage: { url: '', alt: '', caption: '' },
              meta: { description: '', keywords: [], ogImage: '' },
              readTime: '',
              status: 'draft'
            },
            ar: {
              title: '',
              subtitle: '',
              excerpt: '',
              content: { html: '', plainText: '', wordCount: 0 },
              featuredImage: { url: '', alt: '', caption: '' },
              meta: { description: '', keywords: [], ogImage: '' },
              readTime: '',
              status: 'draft'
            }
          }
        });
        setKeywordsInput('');
        setLocalContent('');
        setArabicKeywordsInput('');
        setLocalArabicContent('');
        setIsDualLanguageMode(false);
        setActiveLanguageTab('en');
      }
    } catch (error) {
      console.error(`Failed to ${mode} article:`, error);
      
      // Show error message
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: `Failed to ${mode} article. Please try again.`,
        confirmButtonText: 'OK'
      });
    }
  };

  if (!isOpen) return null;

  const isLoading = isCreating || isUpdating || isCreatingDual || isUpdatingDual;
  const modalTitle = mode === 'create' ? 'Create New Article' : 'Edit Article';
  const submitButtonText = mode === 'create' ? 'Create Article' : 'Update Article';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary-focus text-primary-content p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FaNewspaper className="text-2xl" />
              <h2 className="text-2xl font-bold">{modalTitle}</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost btn-circle text-primary-content hover:bg-primary-focus"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Basic Info & Content */}
            <div className="space-y-6">
              {/* Basic Information Section */}
              <div className="card bg-base-200 shadow-lg">
                <div className="card-body">
                  <h3 className="card-title text-lg flex items-center gap-2">
                    <FaNewspaper className="text-primary" />
                    Basic Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Slug *</span>
                      </label>
                      <input
                        type="text"
                        name="slug"
                        className="input input-bordered focus:input-primary w-full"
                        value={formData.slug}
                        onChange={handleInputChange}
                        placeholder="article-slug"
                        required
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Language *</span>
                      </label>
                      <select
                        name="language"
                        className="select select-bordered focus:select-primary w-full"
                        value={formData.language}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="en">🇺🇸 English</option>
                        <option value="ar">🇸🇦 Arabic</option>
                        <option value="id">🇮🇩 Indonesian</option>
                        <option value="tr">🇹🇷 Turkish</option>
                      </select>
                    </div>

                    <div className="form-control md:col-span-2">
                      <label className="label">
                        <span className="label-text font-semibold">Title *</span>
                      </label>
                      <input
                        type="text"
                        name="title"
                        className="input input-bordered input-lg focus:input-primary w-full"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter your article title here..."
                        required
                      />
                    </div>

                    <div className="form-control md:col-span-2">
                      <label className="label">
                        <span className="label-text font-semibold">Subtitle</span>
                      </label>
                      <input
                        type="text"
                        name="subtitle"
                        className="input input-bordered focus:input-primary w-full"
                        value={formData.subtitle}
                        onChange={handleInputChange}
                        placeholder="Enter article subtitle (optional)"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Author *</span>
                      </label>
                      <input
                        type="text"
                        name="author"
                        className="input input-bordered focus:input-primary w-full"
                        value={formData.author}
                        onChange={handleInputChange}
                        placeholder="Author name"
                        required
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Read Time</span>
                      </label>
                      <input
                        type="text"
                        name="readTime"
                        className="input input-bordered focus:input-primary w-full"
                        value={formData.readTime}
                        onChange={handleInputChange}
                        placeholder="5 min read"
                      />
                    </div>

                    <div className="form-control md:col-span-2">
                      <label className="label">
                        <span className="label-text font-semibold">Excerpt</span>
                      </label>
                      <textarea
                        name="excerpt"
                        className="textarea textarea-bordered focus:textarea-primary w-full"
                        value={formData.excerpt}
                        onChange={handleInputChange}
                        placeholder="Brief description of the article..."
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Dual-Language Toggle */}
              <div className="card bg-gradient-to-r from-primary/10 to-secondary/10 shadow-lg border-2 border-primary/20">
                <div className="card-body">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FaLanguage className="text-primary text-2xl" />
                      <div>
                        <h3 className="font-bold text-xl text-primary">Dual-Language Support</h3>
                        <p className="text-sm text-base-content/70">Enable Arabic version for this article</p>
                        <p className="text-xs text-primary/70 mt-1">
                          {isDualLanguageMode ? '✅ Arabic content enabled' : '❌ Arabic content disabled'}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <input
                        type="checkbox"
                        className="toggle toggle-primary toggle-lg"
                        checked={isDualLanguageMode}
                        onChange={(e) => {
                          console.log('Dual-language toggle clicked:', e.target.checked);
                          setIsDualLanguageMode(e.target.checked);
                        }}
                      />
                      <span className="text-xs text-center">
                        {isDualLanguageMode ? 'ON' : 'OFF'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="card bg-base-200 shadow-lg">
                <div className="card-body">
                  <h3 className="card-title text-lg flex items-center gap-2">
                    <FaEdit className="text-primary" />
                    Article Content *
                  </h3>
                  
                  <div className="border-2 border-base-300 rounded-lg overflow-hidden">
                    <JoditEditor
                      key={`jodit-${formData.language}`}
                      value={localContent}
                      config={joditConfig}
                      onChange={handleContentChange}
                      onBlur={() => {}} // Prevent unnecessary re-renders
                    />
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <span className="text-sm text-base-content/60">
                      Enhanced rich text editor with comprehensive formatting: alignment, colors, fonts, tables, and more
                    </span>
                  </div>
                </div>
              </div>

              {/* Arabic Content Section - Only show when dual-language mode is enabled */}
              {isDualLanguageMode && (
                <div className="card bg-base-200 shadow-lg">
                  <div className="card-body">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="card-title text-lg flex items-center gap-2">
                        <FaLanguage className="text-primary" />
                        Arabic Content
                      </h3>
                      <div className="tabs tabs-boxed">
                        <button
                          type="button"
                          className={`tab ${activeLanguageTab === 'en' ? 'tab-active' : ''}`}
                          onClick={() => setActiveLanguageTab('en')}
                        >
                          🇺🇸 English
                        </button>
                        <button
                          type="button"
                          className={`tab ${activeLanguageTab === 'ar' ? 'tab-active' : ''}`}
                          onClick={() => setActiveLanguageTab('ar')}
                        >
                          🇸🇦 Arabic
                        </button>
                      </div>
                    </div>

                    {activeLanguageTab === 'ar' && (
                      <div className="space-y-4">
                        {/* Arabic Title */}
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-semibold">Arabic Title *</span>
                          </label>
                          <input
                            type="text"
                            className="input input-bordered input-lg focus:input-primary w-full"
                            value={formData.dualLanguage.ar.title}
                            onChange={(e) => handleDualLanguageInputChange(e, 'ar', 'title')}
                            placeholder="Enter Arabic title here..."
                            dir="rtl"
                            style={{ fontFamily: 'Cairo-Regular, Arial, sans-serif' }}
                          />
                        </div>

                        {/* Arabic Subtitle */}
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-semibold">Arabic Subtitle</span>
                          </label>
                          <input
                            type="text"
                            className="input input-bordered focus:input-primary w-full"
                            value={formData.dualLanguage.ar.subtitle}
                            onChange={(e) => handleDualLanguageInputChange(e, 'ar', 'subtitle')}
                            placeholder="Enter Arabic subtitle (optional)"
                            dir="rtl"
                            style={{ fontFamily: 'Cairo-Regular, Arial, sans-serif' }}
                          />
                        </div>

                        {/* Arabic Excerpt */}
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-semibold">Arabic Excerpt</span>
                          </label>
                          <textarea
                            className="textarea textarea-bordered focus:textarea-primary w-full"
                            value={formData.dualLanguage.ar.excerpt}
                            onChange={(e) => handleDualLanguageInputChange(e, 'ar', 'excerpt')}
                            placeholder="Enter Arabic excerpt (optional)"
                            rows={3}
                            dir="rtl"
                            style={{ fontFamily: 'Cairo-Regular, Arial, sans-serif' }}
                          />
                        </div>

                        {/* Arabic Content Editor */}
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-semibold">Arabic Content *</span>
                          </label>
                          <div className="border-2 border-base-300 rounded-lg overflow-hidden">
                            <JoditEditor
                              key="jodit-arabic"
                              value={localArabicContent}
                              config={joditConfig}
                              onChange={handleArabicContentChange}
                              onBlur={() => {}}
                            />
                          </div>
                        </div>

                        {/* Arabic Read Time */}
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-semibold">Arabic Read Time</span>
                          </label>
                          <input
                            type="text"
                            className="input input-bordered focus:input-primary w-full"
                            value={formData.dualLanguage.ar.readTime}
                            onChange={(e) => handleDualLanguageInputChange(e, 'ar', 'readTime')}
                            placeholder="e.g., 5 min read"
                            dir="rtl"
                            style={{ fontFamily: 'Cairo-Regular, Arial, sans-serif' }}
                          />
                        </div>

                        {/* Arabic Status */}
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-semibold">Arabic Status</span>
                          </label>
                          <select
                            className="select select-bordered focus:select-primary w-full"
                            value={formData.dualLanguage.ar.status}
                            onChange={(e) => handleDualLanguageInputChange(e, 'ar', 'status')}
                          >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {activeLanguageTab === 'en' && (
                      <div className="space-y-4">
                        {/* English Title */}
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-semibold">English Title *</span>
                          </label>
                          <input
                            type="text"
                            className="input input-bordered input-lg focus:input-primary w-full"
                            value={formData.dualLanguage.en.title}
                            onChange={(e) => handleDualLanguageInputChange(e, 'en', 'title')}
                            placeholder="Enter English title here..."
                          />
                        </div>

                        {/* English Subtitle */}
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-semibold">English Subtitle</span>
                          </label>
                          <input
                            type="text"
                            className="input input-bordered focus:input-primary w-full"
                            value={formData.dualLanguage.en.subtitle}
                            onChange={(e) => handleDualLanguageInputChange(e, 'en', 'subtitle')}
                            placeholder="Enter English subtitle (optional)"
                          />
                        </div>

                        {/* English Excerpt */}
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-semibold">English Excerpt</span>
                          </label>
                          <textarea
                            className="textarea textarea-bordered focus:textarea-primary w-full"
                            value={formData.dualLanguage.en.excerpt}
                            onChange={(e) => handleDualLanguageInputChange(e, 'en', 'excerpt')}
                            placeholder="Enter English excerpt (optional)"
                            rows={3}
                          />
                        </div>

                        {/* English Content Editor */}
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-semibold">English Content *</span>
                          </label>
                          <div className="border-2 border-base-300 rounded-lg overflow-hidden">
                            <JoditEditor
                              key="jodit-english"
                              value={formData.dualLanguage.en.content.html}
                              config={joditConfig}
                              onChange={(content) => {
                                const tempDiv = document.createElement('div');
                                tempDiv.innerHTML = content;
                                const plainText = tempDiv.textContent || tempDiv.innerText || '';
                                const wordCount = plainText.trim().split(/\s+/).filter(word => word.length > 0).length;

                                setFormData(prev => ({
                                  ...prev,
                                  dualLanguage: {
                                    ...prev.dualLanguage,
                                    en: {
                                      ...prev.dualLanguage.en,
                                      content: {
                                        html: content,
                                        plainText,
                                        wordCount
                                      }
                                    }
                                  }
                                }));
                              }}
                              onBlur={() => {}}
                            />
                          </div>
                        </div>

                        {/* English Read Time */}
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-semibold">English Read Time</span>
                          </label>
                          <input
                            type="text"
                            className="input input-bordered focus:input-primary w-full"
                            value={formData.dualLanguage.en.readTime}
                            onChange={(e) => handleDualLanguageInputChange(e, 'en', 'readTime')}
                            placeholder="e.g., 5 min read"
                          />
                        </div>

                        {/* English Status */}
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-semibold">English Status</span>
                          </label>
                          <select
                            className="select select-bordered focus:select-primary w-full"
                            value={formData.dualLanguage.en.status}
                            onChange={(e) => handleDualLanguageInputChange(e, 'en', 'status')}
                          >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Media, SEO, Settings */}
            <div className="space-y-6">
              {/* Media Section */}
              <div className="card bg-base-200 shadow-lg">
                <div className="card-body">
                  <h3 className="card-title text-lg flex items-center gap-2">
                    <FaImage className="text-primary" />
                    Featured Image
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Image URL *</span>
                      </label>
                      <input
                        type="url"
                        name="featuredImage.url"
                        className="input input-bordered focus:input-primary w-full"
                        value={formData.featuredImage.url}
                        onChange={handleInputChange}
                        placeholder="https://example.com/image.jpg"
                        required
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Alt Text *</span>
                      </label>
                      <input
                        type="text"
                        name="featuredImage.alt"
                        className="input input-bordered focus:input-primary w-full"
                        value={formData.featuredImage.alt}
                        onChange={handleInputChange}
                        placeholder="Image description for accessibility"
                        required
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Caption</span>
                      </label>
                      <input
                        type="text"
                        name="featuredImage.caption"
                        className="input input-bordered focus:input-primary w-full"
                        value={formData.featuredImage.caption}
                        onChange={handleInputChange}
                        placeholder="Image caption (optional)"
                      />
                    </div>

                    {/* Image Preview */}
                    {formData.featuredImage.url && (
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">Preview</span>
                        </label>
                        <div className="border-2 border-dashed border-base-300 rounded-lg p-4">
                          <img
                            src={formData.featuredImage.url}
                            alt={formData.featuredImage.alt || 'Preview'}
                            className="max-w-full h-auto max-h-48 mx-auto rounded-lg shadow-lg"
                            onError={(e) => {
                              const target = e.currentTarget as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'block';
                            }}
                          />
                          <div className="hidden text-center text-base-content/60">
                            <FaImage className="text-4xl mx-auto mb-2" />
                            <p>Image preview not available</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SEO Section */}
              <div className="card bg-base-200 shadow-lg">
                <div className="card-body">
                  <h3 className="card-title text-lg flex items-center gap-2">
                    <FaTags className="text-primary" />
                    SEO & Meta
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Meta Description</span>
                      </label>
                      <textarea
                        name="meta.description"
                        className="textarea textarea-bordered focus:textarea-primary w-full"
                        value={formData.meta.description}
                        onChange={handleInputChange}
                        placeholder="SEO description for search engines..."
                        rows={3}
                      />
                      <label className="label">
                        <span className="label-text-alt text-base-content/60">
                          Recommended: 150-160 characters
                        </span>
                      </label>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Keywords</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered focus:input-primary w-full"
                        value={keywordsInput}
                        onChange={handleKeywordsChange}
                        placeholder="keyword1, keyword2, keyword3"
                      />
                      <label className="label">
                        <span className="label-text-alt text-base-content/60">
                          Separate keywords with commas
                        </span>
                      </label>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Open Graph Image URL</span>
                      </label>
                      <input
                        type="url"
                        name="meta.ogImage"
                        className="input input-bordered focus:input-primary w-full"
                        value={formData.meta.ogImage}
                        onChange={handleInputChange}
                        placeholder="https://example.com/og-image.jpg"
                      />
                      <label className="label">
                        <span className="label-text-alt text-base-content/60">
                          Image for social media sharing (optional)
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Arabic SEO Section - Only show when dual-language mode is enabled */}
              {isDualLanguageMode && (
                <div className="card bg-base-200 shadow-lg">
                  <div className="card-body">
                    <h3 className="card-title text-lg flex items-center gap-2">
                      <FaLanguage className="text-primary" />
                      Arabic SEO & Meta
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">Arabic Meta Description</span>
                        </label>
                        <textarea
                          className="textarea textarea-bordered focus:textarea-primary w-full"
                          value={formData.dualLanguage.ar.meta.description}
                          onChange={(e) => handleDualLanguageInputChange(e, 'ar', 'meta.description')}
                          placeholder="Arabic SEO description for search engines..."
                          rows={3}
                          dir="rtl"
                          style={{ fontFamily: 'Cairo-Regular, Arial, sans-serif' }}
                        />
                        <label className="label">
                          <span className="label-text-alt text-base-content/60">
                            Recommended: 150-160 characters
                          </span>
                        </label>
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">Arabic Keywords</span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered focus:input-primary w-full"
                          value={arabicKeywordsInput}
                          onChange={handleArabicKeywordsChange}
                          placeholder="كلمة مفتاحية 1، كلمة مفتاحية 2، كلمة مفتاحية 3"
                          dir="rtl"
                          style={{ fontFamily: 'Cairo-Regular, Arial, sans-serif' }}
                        />
                        <label className="label">
                          <span className="label-text-alt text-base-content/60">
                            Separate keywords with commas
                          </span>
                        </label>
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">Arabic Open Graph Image URL</span>
                        </label>
                        <input
                          type="url"
                          className="input input-bordered focus:input-primary w-full"
                          value={formData.dualLanguage.ar.meta.ogImage}
                          onChange={(e) => handleDualLanguageInputChange(e, 'ar', 'meta.ogImage')}
                          placeholder="https://example.com/arabic-og-image.jpg"
                        />
                        <label className="label">
                          <span className="label-text-alt text-base-content/60">
                            Image for social media sharing (optional)
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Section */}
              <div className="card bg-base-200 shadow-lg">
                <div className="card-body">
                  <h3 className="card-title text-lg flex items-center gap-2">
                    <FaGlobe className="text-primary" />
                    Article Settings
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">Status</span>
                        </label>
                        <select
                          name="status"
                          className="select select-bordered focus:select-primary w-full"
                          value={formData.status}
                          onChange={handleInputChange}
                        >
                          <option value="draft">📝 Draft</option>
                          <option value="published">✅ Published</option>
                          <option value="archived">📁 Archived</option>
                        </select>
                      </div>

                      <div className="form-control">
                        <label className="label cursor-pointer">
                          <span className="label-text font-semibold flex items-center gap-2">
                            <FaStar className="text-primary" />
                            Featured
                          </span>
                          <input
                            type="checkbox"
                            name="isFeatured"
                            className="toggle toggle-primary toggle-lg"
                            checked={formData.isFeatured}
                            onChange={handleInputChange}
                          />
                        </label>
                      </div>

                      <div className="form-control">
                        <label className="label cursor-pointer">
                          <span className="label-text font-semibold flex items-center gap-2">
                            <FaClock className="text-primary" />
                            Latest
                          </span>
                          <input
                            type="checkbox"
                            name="isLatest"
                            className="toggle toggle-primary toggle-lg"
                            checked={formData.isLatest}
                            onChange={handleInputChange}
                          />
                        </label>
                      </div>
                    </div>

                    {/* Categories and Series Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold flex items-center gap-2">
                            <FaFolder className="text-primary" />
                            Categories
                          </span>
                        </label>
                        <select
                          name="categories"
                          className="select select-bordered focus:select-primary w-full"
                          value={formData.categories.length > 0 ? formData.categories[0] : ''}
                          onChange={(e) => {
                            const categoryId = e.target.value;
                            if (categoryId && !formData.categories.includes(categoryId)) {
                              setFormData(prev => ({ 
                                ...prev, 
                                categories: [...prev.categories, categoryId]
                              }));
                            }
                          }}
                        >
                          <option value="">Select Categories</option>
                          {categoriesResponse?.data?.map((category) => (
                            <option key={category._id} value={category._id}>
                              {category.title}
                            </option>
                          ))}
                        </select>
                        
                        {/* Display selected categories */}
                        {formData.categories.length > 0 && (
                          <div className="mt-2 space-y-2">
                            <label className="label">
                              <span className="label-text-alt text-base-content/60">Selected Categories:</span>
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {formData.categories.map((categoryId) => {
                                const category = categoriesResponse?.data?.find(c => c._id === categoryId);
                                return category ? (
                                  <div key={categoryId} className="badge badge-primary gap-2">
                                    {category.title}
                                    <button
                                      type="button"
                                      className="btn btn-ghost btn-xs p-0 min-h-0 h-auto"
                                      onClick={() => {
                                        setFormData(prev => ({
                                          ...prev,
                                          categories: prev.categories.filter(id => id !== categoryId)
                                        }));
                                      }}
                                    >
                                      ×
                                    </button>
                                  </div>
                                ) : null;
                              })}
                            </div>
                          </div>
                        )}
                        
                        <label className="label">
                          <span className="label-text-alt text-base-content/60">
                            Click to add categories, click × to remove
                          </span>
                        </label>
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold flex items-center gap-2">
                            <FaBook className="text-primary" />
                            Series
                          </span>
                        </label>
                        <select
                          name="series"
                          className="select select-bordered focus:select-primary w-full"
                          value={formData.series?.id || ''}
                          onChange={(e) => {
                            const seriesId = e.target.value;
                            if (seriesId) {
                              setFormData(prev => ({ 
                                ...prev, 
                                series: { id: seriesId, order: 1 }
                              }));
                            } else {
                              setFormData(prev => ({ ...prev, series: undefined }));
                            }
                          }}
                        >
                          <option value="">No Series</option>
                          {seriesResponse?.data?.map((series) => (
                            <option key={series._id} value={series._id}>
                              {series.title}
                            </option>
                          ))}
                        </select>
                        <label className="label">
                          <span className="label-text-alt text-base-content/60">
                            Optional: Assign article to a series
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="alert alert-info">
                      <FaInfoCircle className="text-xl" />
                      <div>
                        <h3 className="font-bold">Article Settings</h3>
                        <div className="text-sm">
                          <p>• <strong>Draft:</strong> Article is saved but not visible to readers</p>
                          <p>• <strong>Published:</strong> Article is live and visible to readers</p>
                          <p>• <strong>Featured:</strong> Article will be highlighted on the homepage</p>
                          <p>• <strong>Latest:</strong> Article will appear in the latest articles section</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-8 border-t border-base-300 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost btn-lg"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-md"></span>
              ) : (
                <FaSave />
              )}
              {submitButtonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ArticleModal;
