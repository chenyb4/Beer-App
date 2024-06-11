#!/bin/sh

docker compose down api
docker compose build api
docker compose up -d api
docker compose up -d db