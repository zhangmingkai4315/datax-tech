DROP DATABASE IF EXISTS `datax-tech-development`;
CREATE DATABASE IF NOT EXISTS `datax-tech-development`  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

DROP DATABASE IF EXISTS `datax-tech-test`;
CREATE DATABASE IF NOT EXISTS `datax-tech-test`  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

DROP DATABASE IF EXISTS `datax-tech-production`;
CREATE DATABASE IF NOT EXISTS `datax-tech-production`  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- Enable client program to communicate with the server using utf8 character set

SET NAMES 'utf8';

SHOW DATABASES;