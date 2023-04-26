#!/bin/sh
export HOME="/home/ubuntu/"
sudo chown -R ubuntu "/home/ubuntu/"
echo "Start application_stop lifecycle event hooks"

node -e "console.log('Running Node.js ' + process.version)"

echo "Start ApplicationStop lifecycle event hooks"
cd "/home/ubuntu/"

cd "/opt/" && ls

echo "Done !"
