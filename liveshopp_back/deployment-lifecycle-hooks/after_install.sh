#!/bin/sh
export HOME="/home/ubuntu/"
export APP="/opt/"

echo "========== After Install =========="

cd $HOME
rsync -av --progress $HOME $APP --exclude install --exclude node_modules --exclude test --exclude .pm2

cd $APP
node -e "console.log('Running Node.js ' + process.version)"

echo "Installing app dependencies"
sudo npm ci --omit=dev
