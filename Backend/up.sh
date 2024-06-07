#!/bin/sh

docker compose build api
docker compose up -d api
docker compose up -d db