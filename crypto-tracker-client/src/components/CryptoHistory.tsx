import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useUnit } from "effector-react";
import HistoricalChart from "./HistoricalChart";
import { $cryptoData, setStartDate } from "../stores/cryptoStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import moment from "moment";

const CryptoHistory: React.FC = () => {
  const { loading, error, historicalPrices } = useUnit($cryptoData);
  const [timeRange, setTimeRange] = useState("90d");

  useEffect(() => {
    // Calculate the start date based on the selected time range using moment
    const referenceDate = moment();
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = referenceDate.clone().subtract(daysToSubtract, "days");

    setStartDate(startDate.toDate());
  }, [timeRange]);

  if (!error && !loading && !historicalPrices?.length) return null;

  return (
    <Card className="mb-4">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Price History</CardTitle>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            data-testid="select-trigger"
            className="w-[160px] rounded-lg sm:ml-auto data-[disabled]:pointer-events-auto"
          >
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d">Last 3 months</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="p-4">
        {loading && <p>Loading historical data...</p>}
        {error && <p>Error fetching historical prices: {error}</p>}
        {historicalPrices.length > 0 && (
          <HistoricalChart data={historicalPrices} />
        )}
      </CardContent>
    </Card>
  );
};

export default CryptoHistory;
