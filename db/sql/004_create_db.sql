-- `test`データベースを新たに作成する

CREATE DATABASE IF NOT EXISTS `test`;

GRANT ALL ON test.* TO `docker`@`%`;
