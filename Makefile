all:	secrets creat compose

compose: 
	docker compose up -d

down: 
	docker compose down -v

prune: 
	docker system prune -af --volumes

volumes:
	docker volume rm $$(docker volume ls -q) 2>/dev/null || true
	rm -rf vol

rmi:
	docker container rm -f $$(docker ps -aq) 2>/dev/null || true
	docker rmi -f $$(docker images -q) 2>/dev/null || true

clean:	down
	$(MAKE) prune
	$(MAKE) rmi

creat:
	mkdir -p vol/db/data
 	chown root:root vol/db/data
	chmod 755 vol/db/data
	chmod +x myadmin/conff.sh
	chmod +x db/conf.sh

secrets:
	@mkdir -p secrets
	openssl rand -hex 2 > secrets/data_pswd
# 	openssl rand -hex 4 > secrets/wordpress_db_password
# 	openssl rand -hex 4 > secrets/wordpress_admin_password
# 	openssl rand -hex 4 > secrets/wordpress_user_password
	openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout secrets/nginx.key -out secrets/nginx.crt -subj "/CN=tvoisin.42.fr"

fclean: clean
	docker volume prune -f
	docker network prune -f
	rm -r secrets
	$(MAKE) volumes
# 	hosts_remove

re: fclean all

# hosts_add:
# 	@echo "Ajout de ft_tr_dreamteam.fr dans /etc/hosts"
# 	@if ! grep -q "127.0.0.1 ft_tr_dreamteam.fr" /etc/hosts; then \
# 		sudo -- sh -c "echo '127.0.0.1 ft_tr_dreamteam.fr' >> /etc/hosts"; \
# 	else \
# 		echo "ft_tr_dreamteam.fr déjà présent"; \
# 	fi

# hosts_remove:
# 	@echo "Suppression de ft_tr_dreamteam.fr du fichier hosts"
# 	sed -i.bak '/127.0.0.1 ft_tr_dreamteam\.fr/d' /etc/hosts || true

.PHONY: all compose down prune creat rmi volumes clean secrets fclean re