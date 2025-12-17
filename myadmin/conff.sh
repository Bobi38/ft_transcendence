#! /bin/bash

set -e

CONFIG_FILE="/var/www/html/config.inc.php"

sed -i "s|\$cfg\['Servers'\]\[\$i\]\['user'\].*|\$cfg['Servers'][\$i]['user'] = '${MYSQL_USER}';|" "$CONFIG_FILE"
sed -i "s|\$cfg\['Servers'\]\[\$i\]\['password'\].*|\$cfg['Servers'\][\$i]['password'] = '${MYSQL_USER_PSW}';|" "$CONFIG_FILE"

echo "✅ phpMyAdmin configuré"