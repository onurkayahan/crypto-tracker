import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";

const ThemeSwitchButton: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains("dark");
  });

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);
  return (
    <div className="absolute top-4 right-4">
      <Button onClick={toggleTheme} variant="ghost" size="icon">
        {isDarkMode ? (
          <MdOutlineLightMode size={24} />
        ) : (
          <MdOutlineDarkMode size={24} />
        )}
      </Button>
    </div>
  );
};

export default ThemeSwitchButton;
