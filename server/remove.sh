#!/bin/bash

sudo docker stop $(sudo docker ps -a -q --filter ancestor='ptserver')
sudo docker rm $(sudo docker ps -a -q --filter ancestor='ptserver')
  
