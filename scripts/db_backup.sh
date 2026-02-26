#!/bin/sh
# AI Ride Hailing: Automated Database Backup Script
# Powered by EXL Solutions

set -e

BACKUP_DIR="/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DATABASE_NAME=$(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')

echo "🚀 Starting backup for database: $DATABASE_NAME at $TIMESTAMP"

# Create backup filename
FILENAME="${DATABASE_NAME}_backup_${TIMESTAMP}.sql.gz"

# Perform pg_dump through the connection string
# We use -v for verbose and pipe to gzip for compression
pg_dump "$DATABASE_URL" | gzip > "${BACKUP_DIR}/${FILENAME}"

echo "✅ Backup completed: ${BACKUP_DIR}/${FILENAME}"

# Cleanup: Keep only the last 7 days of backups
find "${BACKUP_DIR}" -name "${DATABASE_NAME}_backup_*.sql.gz" -mtime +7 -delete
echo "🧹 Old backups cleaned up."
