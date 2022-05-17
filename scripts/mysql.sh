#!/bin/bash

docker-compose exec db bash -c "mysql -u docker -pdocker noratomo"
