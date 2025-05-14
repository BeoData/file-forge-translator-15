
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface TranslationSettingsProps {
  settings: {
    service: string;
    apiKey: string;
    apiEndpoint: string;
    chunkSize: number;
    saveSettings: boolean;
  };
  onSettingsChange: (settings: any) => void;
}

const TranslationSettings = ({ settings, onSettingsChange }: TranslationSettingsProps) => {
  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Translation Service</h3>
        <RadioGroup 
          value={settings.service} 
          onValueChange={(value) => onSettingsChange({ service: value })} 
          className="space-y-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="deepl" id="service-deepl" />
            <Label htmlFor="service-deepl" className="flex flex-col">
              <span className="font-medium">DeepL API</span>
              <span className="text-sm text-gray-500">High quality translations with DeepL API</span>
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="google" id="service-google" />
            <Label htmlFor="service-google" className="flex flex-col">
              <span className="font-medium">Google Cloud Translation</span>
              <span className="text-sm text-gray-500">Google's translation service with extensive language support</span>
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="openai" id="service-openai" />
            <Label htmlFor="service-openai" className="flex flex-col">
              <span className="font-medium">OpenAI GPT</span>
              <span className="text-sm text-gray-500">AI-powered contextual translations</span>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">API Configuration</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <Input 
              type="password"
              id="api-key"
              value={settings.apiKey}
              onChange={(e) => onSettingsChange({ apiKey: e.target.value })}
              placeholder="Enter your API key"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="api-endpoint">API Endpoint</Label>
            <Input 
              type="text"
              id="api-endpoint"
              value={settings.apiEndpoint}
              onChange={(e) => onSettingsChange({ apiEndpoint: e.target.value })}
              placeholder="https://api.deepl.com/v2/translate"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Processing Options</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="chunk-size">Chunk Size (KB)</Label>
            <Input 
              type="number"
              id="chunk-size"
              value={settings.chunkSize}
              onChange={(e) => onSettingsChange({ chunkSize: parseInt(e.target.value) || 10 })}
              min={1}
              max={50}
            />
            <p className="text-sm text-gray-500">Smaller chunks are better for large files but may take longer</p>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="save-settings" 
              checked={settings.saveSettings}
              onCheckedChange={(checked) => onSettingsChange({ saveSettings: checked === true })}
            />
            <Label htmlFor="save-settings">Remember my settings</Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranslationSettings;
