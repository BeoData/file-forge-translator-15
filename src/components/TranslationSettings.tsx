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
import { Globe, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";

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
  const [testingConnection, setTestingConnection] = useState(false);

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

  useEffect(() => {
    // Update local settings when props change (important for the AI button)
    setLocalSettings(settings);
  }, [settings]);

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

  const testHuggingFaceConnection = async () => {
    setTestingConnection(true);
    try {
      // Test the Serbian model specifically
      const model = "perkan/serbian-opus-mt-tc-base-en-sh";
      
      // Direct call to Hugging Face API
      const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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'
        },
        body: JSON.stringify({
          inputs: 'Hello, this is a test message.'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        let translatedText = '';
        
        console.log("Serbian translation test response:", data);
        
        if (Array.isArray(data) && data[0]?.translation_text) {
          translatedText = data[0].translation_text;
        } else if (Array.isArray(data) && data[0]?.generated_text) {
          translatedText = data[0].generated_text;
        } else if (Array.isArray(data) && typeof data[0] === 'string') {
          translatedText = data[0];
        } else {
          translatedText = JSON.stringify(data);
        }
        
        toast({
          title: 'Veza uspešna!',
          description: `Test prevod: "${translatedText}"`
        });
      } else {
        const errorData = await response.json().catch(() => null);
        toast({
          variant: "destructive",
          title: 'Veza neuspešna',
          description: errorData ? JSON.stringify(errorData) : `Status: ${response.status}`
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: 'Greška u konekciji',
        description: error instanceof Error ? error.message : 'Nepoznata greška'
      });
      console.error('Test connection error:', error);
    } finally {
      setTestingConnection(false);
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
          <div className="flex items-center space-x-2 rounded-md p-2 bg-blue-50">
            <RadioGroupItem value="huggingface" id="huggingface" />
            <Label htmlFor="huggingface" className="flex items-center">
              <Globe className="h-4 w-4 mr-2 text-blue-500" />
              Hugging Face API - Serbian Model
              {localSettings.service === 'huggingface' && (
                <span className="ml-2 text-xs text-blue-500 font-normal border border-blue-300 rounded px-1">Active</span>
              )}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mock" id="mock" />
            <Label htmlFor="mock">Mock Translator (Demo)</Label>
          </div>
        </RadioGroup>
      </div>

      {localSettings.service === 'huggingface' && (
        <Alert className="bg-blue-50 border-blue-200">
          <Globe className="h-4 w-4 text-blue-500" />
          <AlertTitle>Hugging Face API aktivna</AlertTitle>
          <AlertDescription>
            Koristi se "perkan/serbian-opus-mt-tc-base-en-sh" model za prevođenje na srpski jezik.
            <Button 
              size="sm" 
              variant="outline" 
              onClick={testHuggingFaceConnection}
              disabled={testingConnection}
              className="mt-2"
            >
              {testingConnection ? 'Testiranje...' : 'Test konekcije'}
            </Button>
          </AlertDescription>
        </Alert>
      )}

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
          Required for DeepL, Google, and custom Hugging Face API keys.
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
            ? "Optional custom Hugging Face API endpoint"
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
              service: 'huggingface',
              chunkSize: 10,
              apiKey: '',
              apiEndpoint: '',
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
