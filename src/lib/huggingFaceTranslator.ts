
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
    console.log(`Translating text from ${source} to ${target}...`);
    
    // Path to the PHP file - adjust if needed
    const apiEndpoint = '/translate.php';
    
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text,
        source,
        target,
        preserve_html: preserveHtml,
        translate_comments: translateComments
      })
    });

    if (!response.ok) {
      console.error(`HTTP error: ${response.status}`);
      return text; // Return original text on error
    }

    const data: HuggingFaceTranslateResponse = await response.json();
    console.log('Translation received:', data);
    
    return data.translated || text;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text on error
  }
}
