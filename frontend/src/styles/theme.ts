import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  styles: {
    global: {
      body: {
        bg: '#1A202C',
        color: 'white',
      },
    },
  },
  colors: {
    brand: {
      primary: '#48BB78',
      secondary: '#9F7AEA',
      accent: '#F6AD55',
    },
    dark: {
      100: '#1A202C',
      200: '#2D3748',
      300: '#4A5568',
    },
  },
  components: {
    Card: {
      baseStyle: {
        container: {
          backgroundColor: 'dark.200',
          borderRadius: 'xl',
          boxShadow: 'lg',
        },
      },
    },
  },
});

export default theme; 