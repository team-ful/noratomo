#!/bin/bash

# docker-compose exec db bash -c "mysql -u docker -pdocker noratomo"

mysql -h 127.0.0.1 -u docker -pdocker noratomo -p
