
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface TranslationOptionsProps {
  settings: {
    preserveHtml: boolean;
    translateComments: boolean;
    chunkProcessing: boolean;
  };
  onSettingsChange: (settings: any) => void;
}

const TranslationOptions = ({ settings, onSettingsChange }: TranslationOptionsProps) => {
  return (
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
  );
};

export default TranslationOptions;
