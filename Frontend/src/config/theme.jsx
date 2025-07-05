// theme.js
import { extendTheme } from "@chakra-ui/react";

const getInitialColorMode = () =>{
    if(typeof localStorage!==undefined){
        const storedTheme = localStorage.getItem("theme");
        if(storedTheme!==null){
            return JSON.parse(storedTheme)?"light":"dark"
        }
    }
    return "light"
}

const config = {
  initialColorMode: getInitialColorMode(),
  useSystemColorMode: false,
};

const customtheme = extendTheme({
  config,
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === "dark" ? "#0F172A" : "#F9FAFB",
        color: props.colorMode === "dark" ? "#F1F5F9" : "#111827",
      },
    }),
  },
  colors: {
    brand: {
      400: "#3A86FF",
    },
    background: {
      light: "#F9FAFB",
      dark: "#0F172A",
    },
    card: {
      light: "#FFFFFF",
      dark: "#1E293B",
    },
    text: {
      light: "#111827",
      dark: "#F1F5F9",
    },
    border: {
      light: "#E5E7EB",
      dark: "#334155",
    },
  },
});

export default customtheme;
