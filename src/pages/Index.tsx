import { useState } from "react";
import FileUploader from "@/components/FileUploader";
import TranslationSettings from "@/components/TranslationSettings";
import TranslationResults from "@/components/TranslationResults";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProcessingModal } from "@/components/ProcessingModal";
import { useToast } from "@/hooks/use-toast";
import { translateFile } from "@/lib/translator";

export interface FileData {
  name: string;
  size: number;
  content: string;
}

export interface TranslationResult {
  originalContent: string;
  translatedContent: string;
  itemCount: number;
  translatedCount: number;
  processingTime: number;
  sourceLanguage: string;
  targetLanguage: string;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState("upload");
  const [file, setFile] = useState<FileData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentChunk, setCurrentChunk] = useState(0);
  const [totalChunks, setTotalChunks] = useState(0);
  const [translationResult, setTranslationResult] = useState<TranslationResult | null>(null);
  const [sourceLanguage, setSourceLanguage] = useState("en");
  const [targetLanguage, setTargetLanguage] = useState("sr");
  const [settings, setSettings] = useState({
    preserveHtml: true,
    translateComments: false,
    chunkProcessing: true,
    service: "mock", // Default to mock translations
    chunkSize: 10,
    apiKey: "",
    apiEndpoint: "/translate.php", // Default path to PHP file
    saveSettings: true
  });
  
  const { toast } = useToast();

  const handleFileChange = (fileData: FileData | null) => {
    setFile(fileData);
  };

  const handleSettingsChange = (newSettings: any) => {
    setSettings({ ...settings, ...newSettings });
  };

  const handleTranslate = async () => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please upload a file to translate"
      });
      return;
    }
    
    try {
      setIsProcessing(true);
      setProgress(0);
      setCurrentChunk(0);
      
      console.log("Starting translation process for file:", file.name);
      console.log("File content length:", file.content.length);
      
      // Estimate number of chunks based on file size and settings
      const estimatedChunks = Math.ceil(file.content.length / (settings.chunkSize * 1024));
      setTotalChunks(estimatedChunks);

      // Create progress tracking callback for the translation process
      const progressCallback = (progress: number, currentChunk: number, totalChunks: number) => {
        setProgress(progress);
        setCurrentChunk(currentChunk);
        setTotalChunks(totalChunks);
      };

      // Start translation process using the actual file content
      const translationOptions = {
        sourceLanguage: sourceLanguage,
        targetLanguage: targetLanguage,
        preserveHtml: settings.preserveHtml,
        translateComments: settings.translateComments,
        chunkProcessing: settings.chunkProcessing,
        service: settings.service,
        apiKey: settings.apiKey,
        apiEndpoint: settings.apiEndpoint
      };

      // Call the translation function with the file content
      const startTime = performance.now();
      const translatedContent = await translateFile(file.content, translationOptions, progressCallback);
      const endTime = performance.now();
      
      // Calculate processing time in seconds
      const processingTime = ((endTime - startTime) / 1000).toFixed(2);
      
      // Get accurate counts of translatable items
      const itemCount = countTranslatableItems(file.content);
      const translatedCount = Math.min(itemCount, countModifiedItems(file.content, translatedContent));
      
      console.log(`Translation complete. Found ${itemCount} items, translated ${translatedCount}.`);
      
      // Create translation result with actual data
      const result: TranslationResult = {
        originalContent: file.content,
        translatedContent,
        itemCount,
        translatedCount,
        processingTime: parseFloat(processingTime),
        sourceLanguage,
        targetLanguage
      };
      
      setTranslationResult(result);
      setIsProcessing(false);
      setActiveTab("results");

      toast({
        title: "Translation complete",
        description: `Successfully translated ${result.translatedCount} out of ${result.itemCount} items.`
      });
    } catch (error) {
      console.error("Translation failed:", error);
      setIsProcessing(false);
      
      toast({
        variant: "destructive",
        title: "Translation failed",
        description: "An error occurred during translation. Please try again."
      });
    }
  };

  // Improved function to count translatable items in content
  const countTranslatableItems = (content: string): number => {
    let count = 0;
    
    // Count single-quoted strings in array syntax
    const singleQuoteMatches = content.match(/'[^']+'\s*=>\s*'[^']+'/g);
    if (singleQuoteMatches) count += singleQuoteMatches.length;
    
    // Count mixed quote strings (single key, double value)
    const mixedQuote1Matches = content.match(/'[^']+'\s*=>\s*"[^"]+"/g);
    if (mixedQuote1Matches) count += mixedQuote1Matches.length;
    
    // Count mixed quote strings (double key, single value)
    const mixedQuote2Matches = content.match(/"[^"]+"\s*=>\s*'[^']+'/g);
    if (mixedQuote2Matches) count += mixedQuote2Matches.length;
    
    // Count double-quoted strings in array syntax
    const doubleQuoteMatches = content.match(/"[^"]+"\s*=>\s*"[^"]+"/g);
    if (doubleQuoteMatches) count += doubleQuoteMatches.length;
    
    console.log("Total translatable items found:", count);
    return count;
  };
  
  // Function to count items that were actually modified in the translation
  const countModifiedItems = (originalContent: string, translatedContent: string): number => {
    // This is a simple approach - in a real app, you might need more sophisticated comparison
    // Extract all values from original and translated content and compare them
    const extractValues = (content: string): string[] => {
      const values: string[] = [];
      
      // Extract single-quoted values
      const singleQuoteRegex = /=>\s*'([^']+)'/g;
      let match;
      while ((match = singleQuoteRegex.exec(content)) !== null) {
        values.push(match[1]);
      }
      
      // Extract double-quoted values
      const doubleQuoteRegex = /=>\s*"([^"]+)"/g;
      while ((match = doubleQuoteRegex.exec(content)) !== null) {
        values.push(match[1]);
      }
      
      return values;
    };
    
    const originalValues = extractValues(originalContent);
    const translatedValues = extractValues(translatedContent);
    
    // Count values that are different between original and translated
    let modifiedCount = 0;
    for (let i = 0; i < Math.min(originalValues.length, translatedValues.length); i++) {
      if (originalValues[i] !== translatedValues[i]) {
        modifiedCount++;
      }
    }
    
    return modifiedCount;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-indigo-700 mb-2 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            Language File Translator
          </h1>
          <p className="text-gray-600">
            Translate language files while preserving the structure. Only values are translated, keys remain intact.
          </p>
        </header>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="border-b w-full justify-start">
              <TabsTrigger value="upload" className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload File
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </TabsTrigger>
              <TabsTrigger value="results" className="flex items-center" disabled={!translationResult}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Results
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="p-6">
              <FileUploader 
                file={file} 
                onFileChange={handleFileChange} 
                sourceLanguage={sourceLanguage}
                targetLanguage={targetLanguage}
                onSourceLanguageChange={setSourceLanguage}
                onTargetLanguageChange={setTargetLanguage}
                settings={settings}
                onSettingsChange={handleSettingsChange}
                onTranslate={handleTranslate}
              />
            </TabsContent>
            
            <TabsContent value="settings" className="p-6">
              <TranslationSettings 
                settings={settings} 
                onSettingsChange={handleSettingsChange} 
              />
            </TabsContent>
            
            <TabsContent value="results" className="p-6">
              {translationResult && (
                <TranslationResults result={translationResult} />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Processing Modal */}
      <ProcessingModal 
        isOpen={isProcessing}
        progress={progress}
        currentChunk={currentChunk}
        totalChunks={totalChunks}
      />
    </div>
  );
};

export default Index;
