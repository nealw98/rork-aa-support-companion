# AA Sober Companion

## Image Assets

The app requires the following image assets to be placed in the `assets` directory:

1. **splash.png** - Splash screen image (recommended size: 1242x2436px)
2. **icon.png** - App icon (1024x1024px)
3. **adaptive-icon.png** - Android adaptive icon foreground (1024x1024px)
4. **favicon.png** - Web favicon (192x192px)

## Other Potential Image Locations

Besides the splash screen and app icon, you might want to add images to:

1. **Profile pictures** - For user profiles if you add that feature
2. **Background images** - For specific screens or sections
3. **Achievement badges** - If you implement a sobriety tracker
4. **Illustrations** - For empty states or onboarding
5. **Logo** - In the app header or about section

## Splash Screen Configuration

The splash screen is configured in `app.json` and uses the `expo-splash-screen` plugin. The splash image will be displayed when the app is loading.