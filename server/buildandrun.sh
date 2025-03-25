#!/bin/bash

sudo docker build -t ptserver .
sudo docker run -itd -p 9090:9090 ptserver
