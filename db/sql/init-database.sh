#!/usr/bin/env bash

# Based on https://qiita.com/A-Kira/items/f401aea261693c395966
# wait for the MySQL Server to come up
# sleep 90s

# run the setup script to create the DB and the schema in the DB
mysql -u docker -pdocker noratomo < /docker-entrypoint-initdb.d/schema.sql
