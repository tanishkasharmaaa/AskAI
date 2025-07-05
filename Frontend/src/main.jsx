import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { ToggleThemeContextProvider } from './context/ToggleTheme.jsx';
import customtheme from './config/theme.jsx';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ChakraProvider theme={customtheme}>
        <ColorModeScript initialColorMode={customtheme.config.initialColorMode} />
        <ToggleThemeContextProvider>
          <App />
        </ToggleThemeContextProvider>
      </ChakraProvider>
    </BrowserRouter>
  </StrictMode>
);
