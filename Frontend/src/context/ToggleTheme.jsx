import { createContext, useEffect, useState } from "react";
import React from "react";
import { useColorMode } from "@chakra-ui/react";

export const ToggleThemeContext = createContext();

export const ToggleThemeContextProvider = ({ children }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [light, setLight] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(light));
    const isLight = colorMode === "light";
    if (light !== isLight) {
      toggleColorMode(); // Sync Chakra's mode with your context
    }
  }, [light]);

  return (
    <ToggleThemeContext.Provider value={{ light, setLight }}>
      {children}
    </ToggleThemeContext.Provider>
  );
};
