
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

interface ProcessingModalProps {
  isOpen: boolean;
  progress: number;
  currentChunk: number;
  totalChunks: number;
}

export const ProcessingModal = ({
  isOpen,
  progress,
  currentChunk,
  totalChunks
}: ProcessingModalProps) => {
  return (
    <Dialog open={isOpen} modal>
      <DialogContent 
        className="sm:max-w-md processing-modal"
        onInteractOutside={(e) => {
          // Prevent closing the modal when clicking outside
          e.preventDefault();
        }}
      >
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 mb-4 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="animate-spin w-8 h-8 text-indigo-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Translating your file
          </h3>
          
          <p className="text-gray-600 text-center mb-4">
            Processing chunk {currentChunk} of {totalChunks}...
          </p>
          
          <div className="w-full mb-4">
            <Progress value={progress} />
          </div>
          
          <p className="text-sm text-gray-500 text-center">
            Please don't close this window while translation is in progress.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
