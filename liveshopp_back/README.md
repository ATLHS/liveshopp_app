# Liveshopp backend

Liveshopp backend API and Socket.io

## 🏗️ Installation

### 📦 Requirements

Clone the repository and setup environment variables:

```sh
git clone git@github.com:ATLHS/liveshopp_app.git
cd liveshopp_app/liveshopp_back
cp .env.sample .env
```

Install requirements:

```
brew install npm nvm
nvm install node
nvm use node
npm install
```

#### Redis Stack

Redis is necessary to store the server Socket.io local states.

```sh
brew tap redis-stack/redis-stack
brew install redis-stack
```

See the [official documentation](https://redis.io/docs/latest/operate/oss_and_stack/install/install-stack/mac-os/).

## 👩‍💻 Run locally

Open a terminal to start Redis Stack on its own:

```sh
redis-stack-server
```

Start server at http://localhost:5000

```sh
npm run start
```

Roger you're ready, let's go 🚀
