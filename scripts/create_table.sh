#!/bin/bash

mysql -u docker -pdocker noratomo < "/docker-entrypoint-initdb.d/001_schema.sql"
mysql -u docker -pdocker test < "/docker-entrypoint-initdb.d/001_schema.sql"
