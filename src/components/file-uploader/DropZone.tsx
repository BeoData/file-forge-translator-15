
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { FileData } from "@/pages/Index";

interface DropZoneProps {
  onFileChange: (file: FileData | null) => void;
  useSampleFile: () => void;
}

const DropZone = ({ onFileChange, useSampleFile }: DropZoneProps) => {
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

  return (
    <div 
      className={`border-2 border-dashed rounded-lg p-12 text-center mb-6 transition-colors ${
        isDragging ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20" : "border-gray-300 dark:border-gray-600"
      } dark:bg-gray-800`}
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
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
          Drag & Drop your language file here
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">or</p>
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
  );
};

export default DropZone;
