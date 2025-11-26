**Expo dev client / native modules — Development guide**

- Why: This app uses native modules (e.g. `react-native-webrtc`, `@stripe/stripe-react-native`) that are not supported by the stock Expo Go app. Use a custom Expo Development Client (EAS) or prebuild + run with the React Native CLI.

- Quick options (pick one):

- Option A — EAS Development Client (recommended)
  - Install dependencies and EAS CLI
    ```powershell
    cd "C:\Users\PC\Desktop\yovani tele psy app\patient-app"
    npm install
    npm install -g eas-cli
    # or use npx: npx eas
    ```
  - (Optional) Add `expo-dev-client` if not already installed:
    ```powershell
    npm install expo-dev-client
    ```
  - Login and build a dev client (cloud):
    ```powershell
    eas login
    npm run eas:build:android
    # After the build completes, download/install the APK on your device.
    # You can also use the QR link from EAS to install the dev-client.
    ```

- Option B — Prebuild + React Native CLI (local native toolchain required)
  - Preconditions: Android Studio + SDK, Java, adb in PATH.
  - Commands:
    ```powershell
    cd "C:\Users\PC\Desktop\yovani tele psy app\patient-app"
    npm install
    npm run prebuild:android
    npm run android
    ```

- Common notes
  - If Expo Go crashes with a message that native modules are required, you must use one of the above flows (Expo Go cannot load custom native modules).
  - To inspect device logs (Android):
    ```powershell
    adb logcat | findstr /I "FATAL\|AndroidRuntime\|expo\|ReactNative"
    ```
  - If you build an APK manually, install it with `adb install -r path\to\app.apk`.

If you want, I can add an `expo-dev-client` dependency and update `app.json`/`app.config.js` for plugins — say the word and I’ll patch the repo.
