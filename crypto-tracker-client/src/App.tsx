import CryptoPrice from "@/components/CryptoPrice";
import CryptoHistory from "@/components/CryptoHistory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { $cryptoData, liveDataUpdate } from "@/stores/cryptoStore";
import { useUnit } from "effector-react";
import SelectPairButton from "@/components/SelectPairButton";
import SelectSourceComboBox from "@/components/SelectSourceComboBox";
import ThemeSwitchButton from "@/components/ThemeSwitchButton";
import { useEffect } from "react";
import {
  connectSocket,
  disconnectSocket,
  offLiveDataUpdate,
  onLiveDataUpdate,
} from "./socketService";
import "@/App.css";

const App: React.FC = () => {
  const { selectedPair, supportedPairs } = useUnit($cryptoData);

  useEffect(() => {
    // Connect to WebSocket
    connectSocket();

    // Listen for live data updates
    onLiveDataUpdate((data) => {
      liveDataUpdate(data);
    });

    // Clean up WebSocket connection on component unmount
    return () => {
      offLiveDataUpdate();
      disconnectSocket();
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 relative">
      {/* Theme toggle button */}
      <ThemeSwitchButton />
      {/* Main Card Container */}
      <Card className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-md rounded-lg p-8">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold mb-6 text-center text-gray-900 dark:text-white">
            Crypto Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center flex-col items-center gap-4">
            <div>
              <SelectSourceComboBox />
            </div>
            <div className="flex justify-center gap-4 mb-6">
              {supportedPairs.map((pair) => (
                <SelectPairButton key={pair} pair={pair} />
              ))}
            </div>
            {!selectedPair && (
              <p>
                Select a cryptocurrency to view the price and history chart.
              </p>
            )}
          </div>
          <CryptoPrice />
          <CryptoHistory />
        </CardContent>
      </Card>
    </div>
  );
};

export default App;
