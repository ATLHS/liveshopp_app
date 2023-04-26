#!/bin/sh
export HOME="/home/ubuntu/"
sudo chown -R ubuntu "/home/ubuntu/"

echo "Start application_start lifecycle event hooks"

cd "/home/ubuntu/"

echo "Start ApplicationStart lifecycle event hooks"

echo "Start Nginx"
sudo systemctl start nginx

echo "Start pm2"
cd "/opt/"

pm2 delete all
pm2 start "ecosystem.config.js" --env env
