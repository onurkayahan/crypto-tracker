import React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import moment from "moment";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import { formatPrice } from "../utils";
import { $cryptoData } from "../stores/cryptoStore";
import { useUnit } from "effector-react";

interface HistoricalData {
  price: number;
  timestamp: string;
}

interface HistoricalChartProps {
  data: HistoricalData[];
}

const chartConfig = {
  price: {
    label: "Price",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const HistoricalChart: React.FC<HistoricalChartProps> = ({ data }) => {
  const { selectedPair, isInverse } = useUnit($cryptoData);

  const formattedData = data.map((entry) => ({
    ...entry,
    timestamp: moment(entry.timestamp).format("MMM DD, YYYY"),
  }));

  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-auto h-[250px] w-full pt-6"
      data-testid="chart-container"
    >
      <AreaChart data={formattedData}>
        <defs>
          <linearGradient id="fillPrice" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="hsl(var(--chart-1))"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="hsl(var(--chart-1))"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="timestamp"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          tickFormatter={(value) => {
            const date = new Date(value);
            return date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          }}
        />
        <YAxis
          tickFormatter={(value) => formatPrice(value, selectedPair, isInverse)}
          tickLine={false}
          axisLine={false}
          width={80} // Adjust width if necessary
          tickMargin={8}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelFormatter={(value) => {
                return new Date(value).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });
              }}
              formatter={(value: any) =>
                formatPrice(value as number, selectedPair, isInverse)
              }
              indicator="dot"
            />
          }
        />
        <Area
          dataKey="price"
          type="natural"
          fill="url(#fillPrice)"
          stroke="hsl(var(--chart-1))"
          stackId="a"
        />
        <ChartLegend content={<ChartLegendContent />} />
      </AreaChart>
    </ChartContainer>
  );
};

export default HistoricalChart;
