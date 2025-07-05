// ThemeSync.jsx
import { useColorMode } from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import { ToggleThemeContext } from "../context/ToggleTheme";

const ThemeSync = () => {
  const { light } = useContext(ToggleThemeContext);
  const { setColorMode } = useColorMode();

  useEffect(() => {
    setColorMode(light ? "light" : "dark");
  }, [light, setColorMode]);

  return null;
};

export default ThemeSync;
