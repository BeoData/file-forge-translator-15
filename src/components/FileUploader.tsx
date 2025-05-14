
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FileData } from "@/pages/Index";

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
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFiles = (files: FileList) => {
    const file = files[0];
    if (file) {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onFileChange({
          name: file.name,
          size: file.size,
          content
        });
      };
      
      reader.readAsText(file);
    }
  };

  const handleRemoveFile = () => {
    onFileChange(null);
  };

  const samplePhpContent = `<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Authentication Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines are used during authentication for various
    | messages that we need to display to the user. You are free to modify
    | these language lines according to your application's requirements.
    |
    */

    'failed' => 'These credentials do not match our records.',
    'password' => 'The provided password is incorrect.',
    'throttle' => 'Too many login attempts. Please try again in :seconds seconds.',

    'welcome' => 'Welcome to our application!',
    'greeting' => 'Hello, :name!',
    'profile' => [
        'title' => 'User Profile',
        'description' => 'Manage your profile information',
    ],
    
    'buttons' => [
        'save' => 'Save Changes',
        'cancel' => 'Cancel',
        'delete' => '<i class="fa fa-trash"></i> Delete',
    ],
    
    'messages' => [
        'success' => 'Operation completed successfully!',
        'error' => 'An error occurred. Please try again.',
        'warning' => 'Warning: This action cannot be undone.',
    ],
];`;

  // For demo purposes, load a sample file
  const useSampleFile = () => {
    onFileChange({
      name: "messages.php",
      size: samplePhpContent.length,
      content: samplePhpContent
    });
  };

  return (
    <div>
      {/* File Drop Area */}
      {!file ? (
        <div 
          className={`border-2 border-dashed rounded-lg p-12 text-center mb-6 transition-colors ${
            isDragging ? "border-indigo-500 bg-indigo-50" : "border-gray-300"
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-16 w-16 text-indigo-400 mb-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Drag & Drop your language file here
            </h3>
            <p className="text-gray-500 mb-4">or</p>
            <div className="flex space-x-4">
              <Button
                variant="default"
                onClick={() => document.getElementById("file-input")?.click()}
                className="flex items-center"
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
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" 
                  />
                </svg>
                Browse Files
              </Button>
              <Button
                variant="outline"
                onClick={useSampleFile}
              >
                Use Sample File
              </Button>
            </div>
            <input 
              type="file" 
              id="file-input" 
              className="hidden" 
              accept=".php,.js,.ts,.json,.txt,.html,.xml,.csv"
              onChange={handleFileInputChange}
            />
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-4 bg-indigo-50 flex items-center justify-between mb-6">
          <div className="flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-10 w-10 text-indigo-500 mr-3" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
            <div>
              <p className="font-medium text-gray-800">{file.name}</p>
              <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleRemoveFile} 
            className="text-gray-500 hover:text-gray-700"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </Button>
        </div>
      )}

      {/* Language Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <Label htmlFor="source-language" className="mb-2 block">Source Language</Label>
          <Select value={sourceLanguage} onValueChange={onSourceLanguageChange}>
            <SelectTrigger id="source-language">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Auto Detect</SelectItem>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="de">German</SelectItem>
              <SelectItem value="it">Italian</SelectItem>
              <SelectItem value="sr">Serbian (Latin)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="target-language" className="mb-2 block">Target Language</Label>
          <Select value={targetLanguage} onValueChange={onTargetLanguageChange}>
            <SelectTrigger id="target-language">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="de">German</SelectItem>
              <SelectItem value="it">Italian</SelectItem>
              <SelectItem value="sr">Serbian (Latin)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Settings */}
      <div className="flex flex-wrap gap-6 mb-6">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="preserve-html" 
            checked={settings.preserveHtml} 
            onCheckedChange={(checked) => 
              onSettingsChange({ preserveHtml: checked === true })
            }
          />
          <Label htmlFor="preserve-html">Preserve HTML tags</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="translate-comments" 
            checked={settings.translateComments} 
            onCheckedChange={(checked) => 
              onSettingsChange({ translateComments: checked === true })
            }
          />
          <Label htmlFor="translate-comments">Translate comments</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="chunk-processing" 
            checked={settings.chunkProcessing} 
            onCheckedChange={(checked) => 
              onSettingsChange({ chunkProcessing: checked === true })
            }
          />
          <Label htmlFor="chunk-processing">Process in chunks</Label>
        </div>
      </div>

      {/* Translate Button */}
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
    </div>
  );
};

export default FileUploader;
