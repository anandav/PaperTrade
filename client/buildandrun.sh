#!/bin/bash

docker build -t ptclient .
docker run -d -p 8080:8080 ptclient
