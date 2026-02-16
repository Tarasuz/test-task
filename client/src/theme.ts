import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      50: "#e9fdf0",
      100: "#c6f6d5",
      200: "#9ae6b4",
      300: "#68d391",
      400: "#48bb78",
      500: "#38a169",
      600: "#2f855a",
      700: "#276749",
      800: "#22543d",
      900: "#1c4532",
    },
  },
  styles: {
    global: {
      body: {
        bg: "#0b1510",
        color: "gray.100",
        fontFamily: "'Outfit', system-ui, sans-serif",
      },
      "#root": {
        minHeight: "100vh",
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: "lg",
        fontWeight: "700",
      },
    },
    Input: {
      variants: {
        outline: {
          field: {
            bg: "whiteAlpha.100",
            borderColor: "whiteAlpha.300",
            _hover: { borderColor: "brand.400" },
            _focusVisible: {
              borderColor: "brand.400",
              boxShadow: "0 0 0 1px var(--chakra-colors-brand-400)",
            },
          },
        },
      },
    },
  },
});

export default theme;
