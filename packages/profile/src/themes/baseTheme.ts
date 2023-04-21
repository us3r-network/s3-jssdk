export default {
  fonts: {
    body: "system-ui, sans-serif",
    heading: "inherit",
    monospace: "Menlo, monospace",
  },
  fontSizes: [12, 14, 16, 20, 24, 32, 48, 64, 96],
  fontWeights: {
    body: 400,
    heading: 700,
    bold: 700,
  },
  lineHeights: {
    body: 1.5,
    heading: 1.25,
  },
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  sizes: {
    avatar: 32,
    icon: 24,
  },
  radii: {
    default: 4,
    circle: 99999,
  },
  // rebass variants
  text: {
    heading: {
      fontFamily: "heading",
      lineHeight: "heading",
      fontWeight: "heading",
    },
    display: {
      fontFamily: "heading",
      fontWeight: "heading",
      lineHeight: "heading",
      fontSize: [5, 6, 7],
    },
    caps: {
      textTransform: "uppercase",
      letterSpacing: "0.1em",
    },
  },
  variants: {
    avatar: {
      width: "avatar",
      height: "avatar",
      borderRadius: "circle",
    },
    icon: {
      width: "icon",
      height: "icon",
    },
    modalContent: {
      p: 3,
      bg: "background",
      boxShadow: "modal",
      borderRadius: "default",
    },
  },
  buttons: {
    primary: {
      fontSize: 2,
      fontWeight: "bold",
      color: "background",
      bg: "primary",
      borderRadius: "default",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: 2,
    },
    outline: {
      variant: "buttons.primary",
      color: "primary",
      bg: "transparent",
      boxShadow: "inset 0 0 2px",
    },
    secondary: {
      variant: "buttons.primary",
      color: "background",
      bg: "secondary",
    },
  },
  styles: {
    root: {
      fontFamily: "body",
      fontWeight: "body",
      lineHeight: "body",
    },
  },
};
