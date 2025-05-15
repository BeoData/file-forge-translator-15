<?php
/**
 * PHP Translation Script using Hugging Face API
 * This script handles translation requests from the frontend
 */

// Enable error reporting during development
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Allow cross-origin requests if needed
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

// Log incoming requests for debugging
file_put_contents('debug_log.txt', date('Y-m-d H:i:s') . ' - Request: ' . file_get_contents('php://input') . "\n", FILE_APPEND);

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Get the raw input data
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

// Check if we have valid input
if (!$input || !isset($input['text']) || empty($input['text'])) {
    echo json_encode(['error' => 'Invalid input data']);
    file_put_contents('debug_log.txt', date('Y-m-d H:i:s') . ' - Error: Invalid input data' . "\n", FILE_APPEND);
    exit;
}

// Extract parameters
$text = $input['text'];
$source = isset($input['source']) ? $input['source'] : 'en';
$target = isset($input['target']) ? $input['target'] : 'sr-Latn';
$preserveHtml = isset($input['preserve_html']) ? $input['preserve_html'] : true;
$translateComments = isset($input['translate_comments']) ? $input['translate_comments'] : false;

// Define model mapping for language pairs
$modelMapping = [
    // Serbian translations (default)
    'en-sr-Latn' => 'perkan/serbian-opus-mt-tc-base-en-sh',
    'sr-Latn-en' => 'Helsinki-NLP/opus-mt-sh-en',
    
    // Other language pairs
    'en-fr' => 'Helsinki-NLP/opus-mt-en-fr',
    'fr-en' => 'Helsinki-NLP/opus-mt-fr-en',
    'en-de' => 'Helsinki-NLP/opus-mt-en-de',
    'de-en' => 'Helsinki-NLP/opus-mt-de-en',
    'en-es' => 'Helsinki-NLP/opus-mt-en-es',
    'es-en' => 'Helsinki-NLP/opus-mt-es-en',
    'en-it' => 'Helsinki-NLP/opus-mt-en-it',
    'it-en' => 'Helsinki-NLP/opus-mt-it-en',
    'en-pt' => 'Helsinki-NLP/opus-mt-en-pt',
    'pt-en' => 'Helsinki-NLP/opus-mt-pt-en',
    
    // Fallback for any language to English
    'any-en' => 'Helsinki-NLP/opus-mt-mul-en',
    // Fallback for English to any language
    'en-any' => 't5-base'
];

// For languages not in our mapping, use the general model
$langPair = "$source-$target";
$model = isset($modelMapping[$langPair]) ? $modelMapping[$langPair] : 
         ($source === 'en' ? $modelMapping['en-any'] : 
         ($target === 'en' ? $modelMapping['any-en'] : $modelMapping['en-any']));

// Process HTML tags if needed
$htmlTags = [];
if ($preserveHtml) {
    // Extract HTML tags and replace them with placeholders
    $pattern = '/<[^>]+>/';
    preg_match_all($pattern, $text, $matches);
    if (!empty($matches[0])) {
        $htmlTags = $matches[0];
        foreach ($htmlTags as $key => $tag) {
            $text = str_replace($tag, "{{HTML_TAG_$key}}", $text);
        }
    }
}

// Translate the text
$translated = translateWithHuggingFace($text, $model);

// Restore HTML tags if they were extracted
if ($preserveHtml && !empty($htmlTags)) {
    foreach ($htmlTags as $key => $tag) {
        $translated = str_replace("{{HTML_TAG_$key}}", $tag, $translated);
    }
}

// Directly handle common fallback cases
if ($model === 'perkan/serbian-opus-mt-tc-base-en-sh' && $text === $translated) {
    // If Serbian model didn't translate, try the T5 model as fallback
    $translated = translateWithHuggingFace($text, 't5-base');
}

// Sanity check - if translation is empty, return original text
if (empty($translated) || $translated === "API Error: Empty or invalid response") {
    $translated = $text;
}

// Log the final translation
file_put_contents('debug_log.txt', date('Y-m-d H:i:s') . ' - Final translation: ' . $translated . "\n", FILE_APPEND);

// Return the translation result
echo json_encode([
    'original' => $text,
    'translated' => $translated,
    'source_lang' => $source,
    'target_lang' => $target,
    'model_used' => $model
]);
exit;

/**
 * Translates text using the Hugging Face Translation API
 * 
 * @param string $text Text to translate
 * @param string $model Hugging Face model to use
 * @param string $apiKey Your Hugging Face API key
 * @return string|false Translated text or false on failure
 */
function translateWithHuggingFace($text, $model = "perkan/serbian-opus-mt-tc-base-en-sh", $apiKey = "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") {
    // API endpoint URL for the specified model
    $apiUrl = "https://api-inference.huggingface.co/models/" . $model;
    
    // Set up cURL session
    $curl = curl_init();
    
    // Set cURL options
    curl_setopt_array($curl, [
        CURLOPT_URL => $apiUrl,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "POST",
        CURLOPT_POSTFIELDS => json_encode([
            "inputs" => $text
        ]),
        CURLOPT_HTTPHEADER => [
            "Content-Type: application/json",
            "Authorization: Bearer " . $apiKey
        ],
        // Fix for SSL certificate verification issues if needed
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_SSL_VERIFYHOST => false
    ]);
    
    // Execute cURL request
    $response = curl_exec($curl);
    $err = curl_error($curl);
    $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    
    // Close cURL session
    curl_close($curl);
    
    // Log the response for debugging
    file_put_contents('debug_log.txt', date('Y-m-d H:i:s') . ' - Response: ' . $response . "\n", FILE_APPEND);
    
    // Check for errors
    if ($err) {
        error_log("cURL Error: " . $err);
        return "Error: " . $err;
    }
    
    // Check HTTP status code
    if ($httpCode != 200) {
        error_log("HTTP Error: " . $httpCode . " Response: " . $response);
        return "HTTP Error: " . $httpCode;
    }
    
    // Debug: Log raw response
    error_log("Raw API response: " . $response);
    
    // Parse response
    $result = json_decode($response, true);
    
    // Check if the model is still loading
    if (is_array($result) && isset($result['error']) && strpos($result['error'], 'loading') !== false) {
        error_log("Model is loading. Waiting and retrying...");
        sleep(2); // Wait for the model to load
        return translateWithHuggingFace($text, $model, $apiKey);
    }
    
    // Extract translation text from response based on Hugging Face's response format
    // Different models might have different response structures
    if (is_array($result)) {
        if (isset($result[0]['translation_text'])) {
            return $result[0]['translation_text'];
        } elseif (isset($result['translation_text'])) {
            return $result['translation_text'];
        } elseif (isset($result[0]['generated_text'])) {
            return $result[0]['generated_text'];
        } else {
            error_log("Unexpected response format. Raw response: " . $response);
            // Some models return just an array with the translation
            if (count($result) == 1 && is_string($result[0])) {
                return $result[0];
            }
            return "Translation API error: Unexpected format";
        }
    } else {
        error_log("Failed to decode response as JSON or null result. Raw response: " . $response);
        
        // If response is plain text, just return it as is (some models might return plain text)
        if (is_string($response) && !empty($response) && substr($response, 0, 1) != "{" && substr($response, 0, 1) != "[") {
            return $response;
        }
        
        // Model might be loading - try again
        if (strpos($response, "loading") !== false || strpos($response, "Loading") !== false) {
            sleep(2); // Wait a bit for the model to load
            return translateWithHuggingFace($text, $model, $apiKey);
        }
        return "API Error: Empty or invalid response";
    }
}
?>
