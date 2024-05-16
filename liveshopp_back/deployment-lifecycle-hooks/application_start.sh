#!/bin/sh
export HOME="/home/ubuntu/"
export APP="/opt/"

echo "========== Application Start =========="

echo "Start Nginx"
sudo systemctl start nginx

echo "Start PM2"
cd $APP
pm2 restart "ecosystem.config.js" --env prod