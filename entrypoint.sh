#!/bin/sh
set -e

echo "Starting entrypoint..."
# wait for database and run migrations
echo "Waiting for database and applying migrations..."
until python manage.py migrate --noinput; do
  echo "Migrations failed, retrying in 2s..."
  sleep 2
done

# collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput || true

# exec the container's main process (what's set as CMD in the Dockerfile)
exec "$@"
