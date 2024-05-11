#!/bin/sh
set -e

# Environment variables should be set in your Dockerfile or docker-compose.yml
# MYSQLDB_HOST, MYSQLDB_USER, MYSQLDB_PASSWORD, and MYSQLDB_DATABASE

echo "Waiting for MySQL to start..."
# Wait for MySQL to start
until mysql -h"$MYSQLDB_HOST" -u"$MYSQLDB_USER" -p"$MYSQLDB_PASSWORD" -e "SELECT 1"; do
  >&2 echo "MySQL is unavailable - sleeping"
  sleep 1
done

>&2 echo "MySQL is up - executing command"

# Attempt to create the database if it doesn't exist. Adjust the command for your specific database.
mysql -h"$MYSQLDB_HOST" -u"$MYSQLDB_USER" -p"$MYSQLDB_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS \`$MYSQLDB_DATABASE\`"

# Now you can run Prisma commands
npx prisma db push
npx prisma generate

# Finally, start your application
exec npm run dev
