#!/bin/bash

docker-compose -f docker-compose.deploy.yaml -f docker-compose.yaml $@
