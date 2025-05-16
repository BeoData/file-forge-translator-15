
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
 * Translates text using the Hugging Face API through the PHP proxy
 * @param options Translation options
 * @returns The translated text or the original text if translation fails
 */
export async function translateWithHuggingFace(options: HuggingFaceTranslateOptions): Promise<string> {
  const { text, source, target, preserveHtml = true, translateComments = false } = options;
  
  try {
    console.log(`Translating text from ${source} to ${target} using Hugging Face API...`);
    
    // Path to the PHP file - adjust if needed
    const apiEndpoint = '/translate.php';
    
    // Always force target to sr-Latn when translating to Serbian
    const actualTarget = target === 'sr' ? 'sr-Latn' : target;
    
    // Add user-friendly logging
    console.log(`Using Hugging Face API endpoint: ${apiEndpoint}`);
    console.log(`Using model: perkan/serbian-opus-mt-tc-base-en-sh for Serbian translation`);
    
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text,
        source,
        target: actualTarget,
        preserve_html: preserveHtml,
        translate_comments: translateComments,
        force_model: source === 'en' && actualTarget === 'sr-Latn' ? 'perkan/serbian-opus-mt-tc-base-en-sh' : undefined,
        api_key: "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"
      })
    });

    if (!response.ok) {
      console.error(`HTTP error: ${response.status}`);
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data: HuggingFaceTranslateResponse = await response.json();
    console.log('Translation received:', data);
    
    if (data.translated) {
      console.log('Translation successful using model:', data.model_used);
      return data.translated;
    } else {
      console.error('No translation returned from API');
      return text; // Return original text if no translation
    }
  } catch (error) {
    console.error('Translation error:', error);
    throw error; // Let the calling function handle the error
  }
}
