#!/bin/bash

# Enable debugging (prints commands to stdout)
set -x

docker pull mariuslundgard/simpleweb:latest

docker-compose stop
docker-compose rm -f
docker-compose up -d

# Prune containers and images
docker system prune -f
docker image prune -f
