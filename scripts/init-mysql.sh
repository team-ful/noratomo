#!/bin/bash

docker-compose exec db bash -c "chmod +x docker-entrypoint-initdb.d/init-database.sh"
docker-compose exec db bash -c "./docker-entrypoint-initdb.d/init-database.sh"
