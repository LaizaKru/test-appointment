#!/bin/sh
echo 'Run migrations'
# Run database migrations
npx sequelize db:migrate
npx sequelize db:seed:all
# Start the application
node app.js
