#!/bin/bash

docker-compose build
docker-compose up -d
docker logs media-controller --follow
