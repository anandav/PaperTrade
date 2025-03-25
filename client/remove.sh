#!/bin/bash

sudo docker stop $(sudo docker ps -a -q --filter ancestor='ptclient')
sudo docker rm $(sudo docker ps -a -q --filter ancestor='ptclient')
sudo docker rmi 'ptclient' 
