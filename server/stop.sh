#!/bin/bash

sudo docker stop $(sudo docker ps -a -q -f ancestor='ptserver')

