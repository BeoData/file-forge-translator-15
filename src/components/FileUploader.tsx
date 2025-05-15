
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileData } from "@/pages/Index";
import DropZone from "./file-uploader/DropZone";
import FilePreview from "./file-uploader/FilePreview";
import LanguageSelector from "./file-uploader/LanguageSelector";
import TranslationOptions from "./file-uploader/TranslationOptions";
import { samplePhpContent } from "./file-uploader/sampleData";
import { Globe } from "lucide-react";

interface FileUploaderProps {
  file: FileData | null;
  onFileChange: (file: FileData | null) => void;
  sourceLanguage: string;
  targetLanguage: string;
  onSourceLanguageChange: (language: string) => void;
  onTargetLanguageChange: (language: string) => void;
  settings: {
    preserveHtml: boolean;
    translateComments: boolean;
    chunkProcessing: boolean;
  };
  onSettingsChange: (settings: any) => void;
  onTranslate: () => void;
}

const FileUploader = ({
  file,
  onFileChange,
  sourceLanguage,
  targetLanguage,
  onSourceLanguageChange,
  onTargetLanguageChange,
  settings,
  onSettingsChange,
  onTranslate
}: FileUploaderProps) => {
  // Function to use sample file
  const useSampleFile = () => {
    onFileChange({
      name: "messages.php",
      size: samplePhpContent.length,
      content: samplePhpContent
    });
  };
  
  // Function to remove file
  const handleRemoveFile = () => {
    onFileChange(null);
  };

  // Function to force using Hugging Face API service
  const handleTranslateWithHuggingFace = () => {
    // Update settings to use Hugging Face API
    onSettingsChange({
      ...settings,
      service: 'huggingface'
    });
    
    // After a short delay to ensure settings are updated, trigger translation
    setTimeout(() => {
      onTranslate();
    }, 100);
  };

  return (
    <div>
      {/* File Upload Area */}
      {!file ? (
        <DropZone 
          onFileChange={onFileChange} 
          useSampleFile={useSampleFile}
        />
      ) : (
        <FilePreview 
          file={file} 
          onRemoveFile={handleRemoveFile} 
        />
      )}

      {/* Language Selection */}
      <LanguageSelector 
        sourceLanguage={sourceLanguage}
        targetLanguage={targetLanguage}
        onSourceLanguageChange={onSourceLanguageChange}
        onTargetLanguageChange={onTargetLanguageChange}
      />

      {/* Translation Settings */}
      <TranslationOptions 
        settings={settings}
        onSettingsChange={onSettingsChange}
      />

      {/* Translate Buttons */}
      <div className="flex flex-col space-y-3 mt-4">
        <Button 
          className="w-full"
          size="lg"
          disabled={!file}
          onClick={onTranslate}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" 
            />
          </svg>
          Translate File
        </Button>

        <Button 
          variant="secondary"
          className="w-full"
          size="lg"
          disabled={!file}
          onClick={handleTranslateWithHuggingFace}
        >
          <Globe className="h-5 w-5 mr-2" />
          Translate with Hugging Face AI
        </Button>
      </div>
    </div>
  );
};

export default FileUploader;
