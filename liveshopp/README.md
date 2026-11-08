# Liveshopp app

Liveshopp app uses React-Native to build Android and iOS apps.

## 🏗️ Installation

### 📦 Requirements

Clone the repository and setup environment variables:

```sh
git clone git@github.com:ATLHS/liveshopp_app.git
cd liveshopp_app/liveshopp
cp .env.sample .env
cp sentry.properties.sample ios/sentry.properties
cp sentry.properties.sample android/sentry.properties
```

Install requirements:

```
brew install npm nvm
nvm install node
nvm use node
npm install
```

### 🍏 iOS installation

Please refer to the latest official documentation on [react-native](https://reactnative.dev/docs/environment-setup?platform=ios)

```sh
sudo gem uninstall cocoapods
bundle install
cd ios/
bundle exec pod install --repo-update
```

### 🤖 Android installation

Please refer to the latest official documentation on [react-native](https://reactnative.dev/docs/environment-setup?platform=android)

```sh
brew install --cask zulu@17

# Get path to where cask was installed to double-click installer
brew info --cask zulu@17

cd /opt/homebrew/Caskroom/zulu@17/17.0.11,17.50.19
open .

# Then double click on the installer
```

Next, you need to download and install Android Studio:
https://developer.android.com/studio/index.html

Make sure to check all following boxes:
- [ ] Android SDK 14 (UpsideDownCake)
- [ ] Android SDK Platform 34
- [ ] Android Virtual Device

Make sure to install `Google APIs ARM 64 v8a System Image` (for Apple M1 Silicon) and the SDK Command Line Tools as well.

You can run the following command to make sure everything is installed correctly:
```sh
npx react-native doctor
```

Then update your environment variables:

```sh
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export JAVA_HOME=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
```

Start your Android emulator phone from the Device Manager in Android Studio.

## 👩‍💻 Run locally

Start the backend at the address configured by `REACT_APP_LOCAL_URL` in `.env` (the backend sample uses port `3000`).

### Without Xcode

```sh
npm run ios
npm run android
```

### With Xcode

```sh
npm start
```

Then build and run from Xcode directly.

Roger you're ready, let's go 🚀
