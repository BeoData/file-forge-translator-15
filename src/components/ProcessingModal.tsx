
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
  totalChunks,
}: ProcessingModalProps) => {
  return (
    <Dialog open={isOpen} modal>
      <DialogContent className="sm:max-w-md" showClose={false}>
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 mb-4 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="animate-spin text-indigo-600"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Translating your file</h3>
          <p className="text-gray-600 text-center mb-4">
            Processing chunk {currentChunk} of {totalChunks}...
          </p>
          
          <Progress value={progress} className="w-full mb-4" />
          
          <p className="text-sm text-gray-500 text-center">
            Please don't close this window while translation is in progress.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
