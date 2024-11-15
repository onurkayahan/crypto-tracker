import { useUnit } from "effector-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { $cryptoData, setSelectedSource } from "../stores/cryptoStore";

const SelectSourceComboBox: React.FC = () => {
  const { selectedSource, supportedSources } = useUnit($cryptoData);

  return (
    <Select
      value={selectedSource ?? undefined}
      onValueChange={setSelectedSource}
    >
      <SelectTrigger
        data-testid="select-trigger"
        className="w-[160px] rounded-lg sm:ml-auto data-[disabled]:pointer-events-auto mb-4"
        style={{
          backgroundColor: "hsl(var(--background))", // Indigo background
          color: "hsl(var(--primary))", // White text
          border: "1px solid hsl(var(--border))", // Light gray border
        }}
      >
        <SelectValue placeholder="select source" />
      </SelectTrigger>
      <SelectContent className="rounded-xl">
        {supportedSources.map((source) => (
          <SelectItem key={source} value={source}>
            {source}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SelectSourceComboBox;
