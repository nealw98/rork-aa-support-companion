const tintColorLight = "#4A90E2";

const Colors = {
  light: {
    text: "#333333",
    background: "#fff",
    tint: tintColorLight,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorLight,
    cardBackground: "#f8f9fa",
    accent: "#5CB85C",
    muted: "#6c757d",
    divider: "#e9ecef",
    chatBubbleUser: "#E0F7FF",
    chatBubbleBot: "#FFFFFF",
    chatBubbleGrace: "rgba(186, 85, 211, 0.1)",
    chatBubbleSalty: "rgba(255, 191, 0, 0.1)",
  },
} as const;

export default Colors;