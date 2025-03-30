#!/bin/bash

docker build -t ptserver .
docker run -d -p 9090:9090 ptserver
