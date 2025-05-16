
interface HuggingFaceTranslateOptions {
  text: string;
  source: string;
  target: string;
  preserveHtml?: boolean;
  translateComments?: boolean;
}

interface HuggingFaceTranslateResponse {
  original: string;
  translated: string;
  source_lang: string;
  target_lang: string;
  model_used: string;
}

/**
 * Translates text using the Hugging Face API
 * @param options Translation options
 * @returns The translated text or the original text if translation fails
 */
export async function translateWithHuggingFace(options: HuggingFaceTranslateOptions): Promise<string> {
  const { text, source, target, preserveHtml = true, translateComments = false } = options;
  
  try {
    console.log(`Translating text from ${source} to ${target} using Hugging Face API...`);
    
    // Always force target to sr-Latn when translating to Serbian
    const actualTarget = target === 'sr' ? 'sr-Latn' : target;
    
    // Determine which model to use based on language pair
    let model = 't5-base'; // default fallback model
    
    if (source === 'en' && actualTarget === 'sr-Latn') {
      model = 'perkan/serbian-opus-mt-tc-base-en-sh';
    } else {
      // Select an appropriate model based on language pair
      const modelMapping: Record<string, string> = {
        'en-fr': 'Helsinki-NLP/opus-mt-en-fr',
        'fr-en': 'Helsinki-NLP/opus-mt-fr-en',
        'en-de': 'Helsinki-NLP/opus-mt-en-de',
        'de-en': 'Helsinki-NLP/opus-mt-de-en',
        'en-es': 'Helsinki-NLP/opus-mt-en-es',
        'es-en': 'Helsinki-NLP/opus-mt-es-en'
      };
      
      const langPair = `${source}-${actualTarget}`;
      if (modelMapping[langPair]) {
        model = modelMapping[langPair];
      }
    }
    
    console.log(`Using model: ${model} for translation`);
    
    // Handle HTML content if preserveHtml is enabled
    let processedText = text;
    const htmlTags: string[] = [];
    
    if (preserveHtml) {
      // Extract HTML tags and replace them with placeholders
      const pattern = /<[^>]+>/g;
      const matches = text.match(pattern);
      
      if (matches && matches.length > 0) {
        htmlTags.push(...matches);
        matches.forEach((tag, index) => {
          processedText = processedText.replace(tag, `{{HTML_TAG_${index}}}`);
        });
      }
    }
    
    // Direct call to Hugging Face Inference API
    const apiUrl = `https://api-inference.huggingface.co/models/${model}`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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'
      },
      body: JSON.stringify({
        inputs: processedText
      })
    });

    if (!response.ok) {
      console.error(`HTTP error: ${response.status}`);
      throw new Error(`HTTP error: ${response.status}`);
    }

    // Parse the response based on the model type
    const result = await response.json();
    console.log('Translation API response:', result);
    
    let translatedText = '';
    
    if (Array.isArray(result) && result[0]?.translation_text) {
      translatedText = result[0].translation_text;
    } else if (Array.isArray(result) && result[0]?.generated_text) {
      translatedText = result[0].generated_text;
    } else if (typeof result === 'object' && result.translation_text) {
      translatedText = result.translation_text;
    } else if (Array.isArray(result) && typeof result[0] === 'string') {
      translatedText = result[0];
    } else {
      console.error('Unexpected API response format:', result);
      return text; // Return original text as fallback
    }
    
    // Restore HTML tags if they were extracted
    if (preserveHtml && htmlTags.length > 0) {
      htmlTags.forEach((tag, index) => {
        translatedText = translatedText.replace(`{{HTML_TAG_${index}}}`, tag);
      });
    }
    
    console.log('Translation successful:', translatedText);
    return translatedText;
    
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text on error
  }
}
