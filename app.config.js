export default {
  expo: {
    name: "암기력 UP",
    slug: "memoryupupup",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    plugins: [],
    android: {
      package: "com.jaeminson.memoryupupup",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
    },
    ios: {
      bundleIdentifier: "com.jaeminson.memoryupupup",
      supportsTablet: true,
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      eas: {
        projectId: "8c9146ad-5880-46b8-8727-966e2d31e17d",
      },
    },
  },
};
