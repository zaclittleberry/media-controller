#!/bin/bash

docker build -t zaclittleberry/media-controller .
docker kill media-controller
docker rm media-controller
docker run --name=media-controller -p 49160:8080 -it zaclittleberry/media-controller
