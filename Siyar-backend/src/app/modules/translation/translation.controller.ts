import { Request, Response } from 'express';
import translate from 'google-translate-api-x';
import { envVars } from '../../config/env';

export class TranslationController {
  // Health check endpoint
  async health(req: Request, res: Response): Promise<void> {
    res.status(200).json({ 
      success: true,
      status: 'OK', 
      message: 'Translation service is running' 
    });
  }

  // Single translation endpoint
  async translateSingle(req: Request, res: Response): Promise<void> {
    try {
      const { text, to, from = 'auto' } = req.body;
      
      if (!text || !to) {
        res.status(400).json({ 
          success: false,
          error: 'Missing required fields: text and to' 
        });
        return;
      }

      console.log(`Translating: "${text}" from ${from} to ${to}`);
      
      const result = await translate(text, { 
        from, 
        to
      });
      
      res.status(200).json({
        success: true,
        data: {
          text: (result as any).text,
          from: (result as any).from?.language?.iso || from,
          to: to,
          original: text
        }
      });
      
    } catch (error: any) {
      console.error('Translation error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Translation failed',
        message: error.message,
        details: envVars.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  // Batch translation endpoint
  async translateBatch(req: Request, res: Response): Promise<void> {
    try {
      const { texts, to, from = 'auto' } = req.body;
      
      if (!texts || !Array.isArray(texts) || !to) {
        res.status(400).json({ 
          success: false,
          error: 'Missing required fields: texts (array) and to' 
        });
        return;
      }

      console.log(`Batch translating ${texts.length} texts from ${from} to ${to}`);
      
      const results = await translate(texts, { 
        from, 
        to
      });
      
      // Handle both single result and array results
      const translatedTexts = Array.isArray(results) 
        ? results.map((r: any) => r.text)
        : [(results as any).text];
      
      res.status(200).json({
        success: true,
        data: {
          translations: translatedTexts,
          from: from,
          to: to,
          originals: texts,
          count: texts.length
        }
      });
      
    } catch (error: any) {
      console.error('Batch translation error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Batch translation failed',
        message: error.message,
        details: envVars.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  // Get supported languages (static list of common languages)
  async getSupportedLanguages(req: Request, res: Response): Promise<void> {
    const supportedLanguages = {
      'af': 'Afrikaans',
      'sq': 'Albanian',
      'ar': 'Arabic',
      'hy': 'Armenian',
      'az': 'Azerbaijani',
      'eu': 'Basque',
      'be': 'Belarusian',
      'bn': 'Bengali',
      'bs': 'Bosnian',
      'bg': 'Bulgarian',
      'ca': 'Catalan',
      'ceb': 'Cebuano',
      'zh': 'Chinese',
      'zh-cn': 'Chinese (Simplified)',
      'zh-tw': 'Chinese (Traditional)',
      'co': 'Corsican',
      'hr': 'Croatian',
      'cs': 'Czech',
      'da': 'Danish',
      'nl': 'Dutch',
      'en': 'English',
      'eo': 'Esperanto',
      'et': 'Estonian',
      'fi': 'Finnish',
      'fr': 'French',
      'fy': 'Frisian',
      'gl': 'Galician',
      'ka': 'Georgian',
      'de': 'German',
      'el': 'Greek',
      'gu': 'Gujarati',
      'ht': 'Haitian Creole',
      'ha': 'Hausa',
      'haw': 'Hawaiian',
      'he': 'Hebrew',
      'hi': 'Hindi',
      'hmn': 'Hmong',
      'hu': 'Hungarian',
      'is': 'Icelandic',
      'ig': 'Igbo',
      'id': 'Indonesian',
      'ga': 'Irish',
      'it': 'Italian',
      'ja': 'Japanese',
      'jw': 'Javanese',
      'kn': 'Kannada',
      'kk': 'Kazakh',
      'km': 'Khmer',
      'rw': 'Kinyarwanda',
      'ko': 'Korean',
      'ku': 'Kurdish',
      'ky': 'Kyrgyz',
      'lo': 'Lao',
      'la': 'Latin',
      'lv': 'Latvian',
      'lt': 'Lithuanian',
      'lb': 'Luxembourgish',
      'mk': 'Macedonian',
      'mg': 'Malagasy',
      'ms': 'Malay',
      'ml': 'Malayalam',
      'mt': 'Maltese',
      'mi': 'Maori',
      'mr': 'Marathi',
      'mn': 'Mongolian',
      'my': 'Myanmar (Burmese)',
      'ne': 'Nepali',
      'no': 'Norwegian',
      'ny': 'Nyanja (Chichewa)',
      'or': 'Odia (Oriya)',
      'ps': 'Pashto',
      'fa': 'Persian',
      'pl': 'Polish',
      'pt': 'Portuguese',
      'pa': 'Punjabi',
      'ro': 'Romanian',
      'ru': 'Russian',
      'sm': 'Samoan',
      'gd': 'Scots Gaelic',
      'sr': 'Serbian',
      'st': 'Sesotho',
      'sn': 'Shona',
      'sd': 'Sindhi',
      'si': 'Sinhala (Sinhalese)',
      'sk': 'Slovak',
      'sl': 'Slovenian',
      'so': 'Somali',
      'es': 'Spanish',
      'su': 'Sundanese',
      'sw': 'Swahili',
      'sv': 'Swedish',
      'tl': 'Tagalog (Filipino)',
      'tg': 'Tajik',
      'ta': 'Tamil',
      'tt': 'Tatar',
      'te': 'Telugu',
      'th': 'Thai',
      'tr': 'Turkish',
      'tk': 'Turkmen',
      'uk': 'Ukrainian',
      'ur': 'Urdu',
      'ug': 'Uyghur',
      'uz': 'Uzbek',
      'vi': 'Vietnamese',
      'cy': 'Welsh',
      'xh': 'Xhosa',
      'yi': 'Yiddish',
      'yo': 'Yoruba',
      'zu': 'Zulu'
    };

    res.status(200).json({
      success: true,
      data: {
        languages: supportedLanguages,
        count: Object.keys(supportedLanguages).length
      }
    });
  }
}

export default TranslationController;
