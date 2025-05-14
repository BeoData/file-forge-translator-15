
import { Button } from "@/components/ui/button";
import { FileData } from "@/pages/Index";

interface FilePreviewProps {
  file: FileData;
  onRemoveFile: () => void;
}

const FilePreview = ({ file, onRemoveFile }: FilePreviewProps) => {
  return (
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
        onClick={onRemoveFile} 
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
  );
};

export default FilePreview;
