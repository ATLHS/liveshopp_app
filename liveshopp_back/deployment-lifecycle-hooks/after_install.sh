#!/bin/sh
export HOME="/home/ubuntu/"
echo "Start AfterInstall lifecycle event hooks"

cd "/home/ubuntu/"

echo "Folder at the root directory : " && ls

rsync -av --progress "/home/ubuntu/" "/opt/" --exclude install

cd "/opt/"
echo "Folder at the /opt/ directory : " && ls

echo "Installing backend dependencies"
#sudo npm i
#
#cd "/opt/liveshopp_web_front/"
#sudo npm i
