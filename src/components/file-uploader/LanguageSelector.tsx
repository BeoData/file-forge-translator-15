
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface LanguageSelectorProps {
  sourceLanguage: string;
  targetLanguage: string;
  onSourceLanguageChange: (language: string) => void;
  onTargetLanguageChange: (language: string) => void;
}

const LanguageSelector = ({
  sourceLanguage,
  targetLanguage,
  onSourceLanguageChange,
  onTargetLanguageChange
}: LanguageSelectorProps) => {
  return (
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
            <SelectItem value="sr" className="font-medium text-blue-600 bg-blue-50">Serbian (Latin)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default LanguageSelector;
