
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TranslationResult } from "@/pages/Index";
import CodePreview from "./CodePreview";
import { useToast } from "@/hooks/use-toast";

interface TranslationResultsProps {
  result: TranslationResult;
}

const TranslationResults = ({ result }: TranslationResultsProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result.translatedContent).then(() => {
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "The translated content has been copied to your clipboard"
      });
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    });
  };

  const handleDownload = () => {
    // Create a blob from the translated content
    const blob = new Blob([result.translatedContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    
    // Create a download link and trigger it
    const a = document.createElement("a");
    a.href = url;
    const fileName = result.targetLanguage === 'sr' ? 
      "serbian-translated-file.php" : "translated-file.php";
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: "Your translated file is being downloaded"
    });
  };

  // Get language names instead of codes
  const getLanguageName = (code: string) => {
    const languages: Record<string, string> = {
      en: "English",
      es: "Spanish",
      fr: "French",
      de: "German",
      it: "Italian",
      sr: "Serbian (Latin)"
    };
    
    return languages[code] || code;
  };
  
  // Get translation info text depending on language
  const getTranslationInfo = () => {
    if (result.targetLanguage === 'sr') {
      return result.translatedCount === result.itemCount ? 
        "Svi elementi su uspešno prevedeni." :
        "Neki elementi nisu mogli biti prevedeni.";
    } else {
      return result.translatedCount === result.itemCount ? 
        "All items were successfully translated." :
        "Some items could not be translated.";
    }
  };
  
  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {result.targetLanguage === 'sr' ? "Rezultati prevoda" : "Translation Results"}
          </h3>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={handleCopy}
              className="flex items-center"
            >
              {copied ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {result.targetLanguage === 'sr' ? "Kopirano!" : "Copied!"}
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  {result.targetLanguage === 'sr' ? "Kopiraj" : "Copy"}
                </>
              )}
            </Button>
            <Button 
              onClick={handleDownload}
              className="flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {result.targetLanguage === 'sr' ? "Preuzmi" : "Download"}
            </Button>
          </div>
        </div>

        <div className="overflow-auto max-h-96">
          <CodePreview code={result.translatedContent} />
        </div>
      </div>

      {/* Translation summary */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              {result.targetLanguage === 'sr' ? "Rezime prevoda" : "Translation Summary"}
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                <span className="font-medium">
                  {result.targetLanguage === 'sr' ? "Izvor" : "Source"}:
                </span> {getLanguageName(result.sourceLanguage)} → 
                <span className="font-medium">
                  {" "}{result.targetLanguage === 'sr' ? "Cilj" : "Target"}:
                </span> {getLanguageName(result.targetLanguage)}
              </p>
              <p>
                <span className="font-medium">
                  {result.targetLanguage === 'sr' ? "Prevedene stavke" : "Translated items"}:
                </span> {result.translatedCount} {result.targetLanguage === 'sr' ? "od" : "of"} {result.itemCount} 
                {result.translatedCount < result.itemCount && (
                  <span className="text-yellow-600 ml-2">
                    {result.targetLanguage === 'sr' ? "(Neki elementi nisu mogli biti prevedeni)" : "(Some items could not be translated)"}
                  </span>
                )}
              </p>
              <p>
                <span className="font-medium">
                  {result.targetLanguage === 'sr' ? "Vreme obrade" : "Processing time"}:
                </span> {result.processingTime} {result.targetLanguage === 'sr' ? "sekundi" : "seconds"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Original vs Translated Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">
            {result.targetLanguage === 'sr' ? "Pregled originalne datoteke" : "Original File Preview"}
          </h4>
          <div className="overflow-auto h-64">
            <CodePreview code={result.originalContent} />
          </div>
        </div>
        <div>
          <h4 className="font-medium text-gray-900 mb-2">
            {result.targetLanguage === 'sr' ? "Pregled prevedene datoteke" : "Translated File Preview"}
          </h4>
          <div className="overflow-auto h-64">
            <CodePreview code={result.translatedContent} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranslationResults;
