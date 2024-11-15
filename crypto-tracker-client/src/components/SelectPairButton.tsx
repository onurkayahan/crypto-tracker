import React from "react";
import { Button } from "./ui/button";
import {
  $cryptoData,
  setSelectedPair,
  setIsInverse,
} from "../stores/cryptoStore";
import { useUnit } from "effector-react";
import { MdSwapHoriz } from "react-icons/md";
import { renderPairName } from "../utils";

interface SelectPairButtonProps {
  pair: string;
}

const SelectPairButton: React.FC<SelectPairButtonProps> = ({ pair }) => {
  const { selectedPair, isInverse } = useUnit($cryptoData);

  return (
    <Button
      onClick={() => setSelectedPair(pair)}
      variant="outline"
      size="lg"
      className={selectedPair === pair ? "bg-gray-200 dark:bg-gray-700" : ""}
    >
      {selectedPair === pair ? renderPairName(pair, isInverse) : pair}
      {selectedPair === pair && (
        <div
          className="ml-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
          onClick={(event: React.MouseEvent) => {
            event.stopPropagation();
            setIsInverse(!isInverse);
          }}
        >
          <MdSwapHoriz size={24} data-testid="swap-icon" />
        </div>
      )}
    </Button>
  );
};

export default SelectPairButton;
