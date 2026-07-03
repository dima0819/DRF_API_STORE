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

# seed demo data (idempotent - uses get_or_create); only the web container
# sets SEED_DEMO_DATA so celery does not seed concurrently
if [ "$SEED_DEMO_DATA" = "1" ]; then
  echo "Seeding demo data..."
  python manage.py seed_sports_store || true
fi

# exec the container's main process (what's set as CMD in the Dockerfile)
exec "$@"
