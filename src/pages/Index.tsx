
import { useState } from "react";
import FileUploader from "@/components/FileUploader";
import TranslationSettings from "@/components/TranslationSettings";
import TranslationResults from "@/components/TranslationResults";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProcessingModal } from "@/components/ProcessingModal";
import { useToast } from "@/components/ui/use-toast";
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
    service: "deepl",
    chunkSize: 10,
    apiKey: "",
    apiEndpoint: "https://api.deepl.com/v2/translate",
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
    if (!file) return;
    
    try {
      setIsProcessing(true);
      setProgress(0);
      setCurrentChunk(0);
      setTotalChunks(5); // Simulated for now, in a real app this would be calculated

      // Simulate progress for demo
      const interval = setInterval(() => {
        setCurrentChunk(prev => {
          const next = prev + 1;
          setProgress((next / 5) * 100);
          return next;
        });
      }, 600);

      // In a real implementation, this would call your translation API
      // For demo, we'll simulate a delay and use pre-defined translation
      setTimeout(() => {
        clearInterval(interval);
        
        // Simulate translation completion
        const result: TranslationResult = {
          originalContent: file.content,
          translatedContent: simulateTranslation(file.content, targetLanguage),
          itemCount: 24,
          translatedCount: 24,
          processingTime: 1.24,
          sourceLanguage: sourceLanguage === "auto" ? "en" : sourceLanguage,
          targetLanguage
        };
        
        setTranslationResult(result);
        setIsProcessing(false);
        setActiveTab("results");

        toast({
          title: "Translation complete",
          description: `Successfully translated ${result.translatedCount} out of ${result.itemCount} items.`
        });
      }, 3000);
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

  // Simulated translation for demo purposes
  const simulateTranslation = (content: string, targetLang: string): string => {
    // For demonstration, we'll return Serbian translation for PHP language file
    // In a real app, this would call a translation API
    if (targetLang === "sr") {
      return `<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Linije jezika za autentifikaciju
    |--------------------------------------------------------------------------
    |
    | Sledeće linije jezika se koriste tokom autentifikacije za različite
    | poruke koje treba da prikažemo korisniku. Možete ih slobodno modifikovati
    | prema zahtevima vaše aplikacije.
    |
    */

    'failed' => 'Ovi podaci se ne podudaraju sa našim zapisima.',
    'password' => 'Navedena lozinka nije tačna.',
    'throttle' => 'Previše pokušaja prijave. Pokušajte ponovo za :seconds sekundi.',

    'welcome' => 'Dobrodošli u našu aplikaciju!',
    'greeting' => 'Zdravo, :name!',
    'profile' => [
        'title' => 'Korisnički profil',
        'description' => 'Upravljajte informacijama o svom profilu',
    ],
    
    'buttons' => [
        'save' => 'Sačuvaj promene',
        'cancel' => 'Otkaži',
        'delete' => '<i class="fa fa-trash"></i> Obriši',
    ],
    
    'messages' => [
        'success' => 'Operacija uspešno završena!',
        'error' => 'Došlo je do greške. Molimo pokušajte ponovo.',
        'warning' => 'Upozorenje: Ova radnja se ne može poništiti.',
    ],
];`;
    } else {
      // Return original content for other languages
      return content;
    }
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
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
