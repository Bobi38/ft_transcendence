# #! /bin/bash

# MYSQL_ROOT_PASSWORD="$(cat "$MYSQL_ROOT_PASSWORD_FILE")"

# echo "Configuring database connection..."
# mysql -u root -p"$MYSQL_ROOT_PASSWORD" << EOF
# CREATE DATABASE IF NOT EXISTS TRANS;
# DROP USER IF EXISTS '$MYSQL_USER'@'%';
# CREATE USER '$MYSQL_USER'@'%' IDENTIFIED BY '$MYSQL_PASSWORD';
# GRANT ALL PRIVILEGES ON TRANS.* TO '$MYSQL_USER'@'%';
# FLUSH PRIVILEGES;
# USE TRANS;
# CREATE TABLE IF NOT EXISTS user_co (user_id INT NOT NULL AUTO_INCREMENT , name VARCHAR(128) NOT NULL , win INT NOT NULL , total_part INT NOT NULL , PRIMARY KEY (user_id)) ENGINE = InnoDB;
# exit
# EOF

# mysqladmin -u root -p"$MYSQL_ROOT_PASSWORD" shutdown



#!/bin/bash
set -e

echo "Creating tables..."

mysql -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE" <<EOF
CREATE TABLE IF NOT EXISTS user_co (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  win INT NOT NULL,
  total_part INT NOT NULL
);
EOF