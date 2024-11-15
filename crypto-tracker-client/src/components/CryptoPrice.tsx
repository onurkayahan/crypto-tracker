import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUnit } from "effector-react";
import { $cryptoData } from "../stores/cryptoStore";
import { formatPrice, renderPairName } from "../utils";

const CryptoPrice: React.FC = () => {
  const { selectedPair, isInverse, currentPrice, loading, error } =
    useUnit($cryptoData);

  if (!error && !loading && !selectedPair) return null;

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Current Price</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <p>Loading...</p>}
        {error && <p>Error fetching price: {error}</p>}
        {currentPrice && (
          <p>
            {selectedPair && renderPairName(selectedPair, isInverse)}:{" "}
            {formatPrice(currentPrice, selectedPair, isInverse)}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default CryptoPrice;
