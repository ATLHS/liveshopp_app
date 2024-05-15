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
```sh
sudo gem uninstall cocoapods
bundle install
cd ios/
bundle exec pod install
```

### 🤖 Android installation

FIXME

## 👩‍💻 Run locally

Start server at http://localhost:5000

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
