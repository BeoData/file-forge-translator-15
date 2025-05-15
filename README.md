
# Language File Translator

A web application for translating language files while preserving their structure.

## Setup Instructions for PHP Translation Backend

1. **Upload the translate.php file** to your web server. This file should be placed in the root directory of your web application.

2. **Configure API Key**: Open the translate.php file and update the API key on line 188:

```php
function translateWithHuggingFace($text, $model = "perkan/serbian-opus-mt-tc-base-en-sh", $apiKey = "YOUR_HUGGING_FACE_API_KEY") {
```

3. **Set Permissions**: Ensure that the translate.php file has the correct permissions to execute on your web server.

4. **Configure the Application**: In the application settings, select "Hugging Face API (PHP)" as the translation service and set the API endpoint to "/translate.php" or the full path to your PHP file.

## Usage

1. Upload a language file (PHP, JSON, etc.)
2. Select source and target languages
3. Configure translation settings
4. Click "Translate File" to start the translation process
5. Review and download the translated file

## Supported Translation Services

- DeepL API
- Google Translate API
- Hugging Face API via PHP backend
- Mock Translator (for demo purposes)
