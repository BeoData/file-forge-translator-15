
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface TranslationSettingsProps {
  settings: {
    preserveHtml: boolean;
    translateComments: boolean;
    chunkProcessing: boolean;
    service: string;
    chunkSize: number;
    apiKey: string;
    apiEndpoint: string;
    saveSettings: boolean;
  };
  onSettingsChange: (settings: any) => void;
}

const TranslationSettings = ({ settings, onSettingsChange }: TranslationSettingsProps) => {
  const [localSettings, setLocalSettings] = useState({ ...settings });

  useEffect(() => {
    // Load saved settings from localStorage if saveSettings is true
    if (settings.saveSettings) {
      const savedSettings = localStorage.getItem('translationSettings');
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          setLocalSettings({ ...settings, ...parsed });
          onSettingsChange({ ...settings, ...parsed });
        } catch (e) {
          console.error("Error parsing saved settings:", e);
        }
      }
    }
  }, []);

  const handleChange = (key: string, value: any) => {
    const newSettings = { 
      ...localSettings, 
      [key]: value 
    };
    
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
    
    if (newSettings.saveSettings) {
      localStorage.setItem('translationSettings', JSON.stringify(newSettings));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Translation Service</h3>
        <RadioGroup
          value={localSettings.service}
          onValueChange={(value) => handleChange('service', value)}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="deepl" id="deepl" />
            <Label htmlFor="deepl">DeepL API</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="google" id="google" />
            <Label htmlFor="google">Google Translate API</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="huggingface" id="huggingface" />
            <Label htmlFor="huggingface">Hugging Face API (PHP)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mock" id="mock" />
            <Label htmlFor="mock">Mock Translator (Demo)</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="api-key">API Key</Label>
        <Input
          id="api-key"
          type="password"
          value={localSettings.apiKey}
          onChange={(e) => handleChange('apiKey', e.target.value)}
          placeholder="Enter your API key"
        />
        <p className="text-sm text-gray-500">
          Required for DeepL, Google, and Hugging Face API.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="api-endpoint">API Endpoint</Label>
        <Input
          id="api-endpoint"
          value={localSettings.apiEndpoint}
          onChange={(e) => handleChange('apiEndpoint', e.target.value)}
          placeholder="https://api.deepl.com/v2/translate"
        />
        <p className="text-sm text-gray-500">
          {localSettings.service === 'huggingface'
            ? "Path to translate.php file (e.g., /translate.php)"
            : "The API endpoint for the selected translation service"}
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Processing Options</h3>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="chunk-processing" 
            checked={localSettings.chunkProcessing}
            onCheckedChange={(checked) => handleChange('chunkProcessing', checked === true)}
          />
          <Label htmlFor="chunk-processing">Process in chunks</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="preserve-html" 
            checked={localSettings.preserveHtml}
            onCheckedChange={(checked) => handleChange('preserveHtml', checked === true)}
          />
          <Label htmlFor="preserve-html">Preserve HTML tags</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="translate-comments" 
            checked={localSettings.translateComments}
            onCheckedChange={(checked) => handleChange('translateComments', checked === true)}
          />
          <Label htmlFor="translate-comments">Translate comments</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="save-settings" 
            checked={localSettings.saveSettings}
            onCheckedChange={(checked) => handleChange('saveSettings', checked === true)}
          />
          <Label htmlFor="save-settings">Save settings to browser</Label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="chunk-size">
          Chunk Size: {localSettings.chunkSize} items
        </Label>
        <Slider
          id="chunk-size"
          disabled={!localSettings.chunkProcessing}
          value={[localSettings.chunkSize]}
          min={5}
          max={50}
          step={5}
          onValueChange={(values) => handleChange('chunkSize', values[0])}
          className="my-4"
        />
        <p className="text-sm text-gray-500">
          Number of items to process in a single chunk. Smaller chunks may be more reliable but slower.
        </p>
      </div>

      <div className="pt-4 border-t">
        <Button
          onClick={() => handleChange('apiKey', '')}
          variant="outline"
          className="mr-2"
        >
          Clear API Key
        </Button>
        <Button
          onClick={() => {
            const defaultSettings = {
              preserveHtml: true,
              translateComments: false,
              chunkProcessing: true,
              service: 'mock',
              chunkSize: 10,
              apiKey: '',
              apiEndpoint: 'https://api.deepl.com/v2/translate',
              saveSettings: true
            };
            setLocalSettings(defaultSettings);
            onSettingsChange(defaultSettings);
            localStorage.removeItem('translationSettings');
          }}
        >
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
};

export default TranslationSettings;
