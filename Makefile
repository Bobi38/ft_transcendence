SERVICES = \
	mysql \
	myadmin \
	gateway \
	chatp_service \
	user_service \
	chatg_service \
	auth \
	morpion \
	front \
	pong3d

all:
	@echo "⚠️ Vous devez utiliser 'make dev' ou 'make prod' !" 
	@exit 1


prod: secrets creat compose_prod

dev: secrets creat compose_dev

compose_dev:
	docker compose -f docker-compose.dev.yml up -d

compose_prod:
	docker compose -f docker-compose.prod.yml up -d


compose:
	docker compose up -d

down_dev:
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
	chmod +x ./conf/myadmin/conf.sh
	chmod +x ./conf/db/conf.sh

logs%:
	docker compose  -f docker-compose.dev.yml logs -f $(word $*, $(SERVICES))

logs-%:
	docker compose  -f docker-compose.dev.yml logs -f $*
	
logs:
	docker compose  -f docker-compose.dev.yml logs -f
	
logst:
	docker compose  -f docker-compose.dev.yml logs -f -t
	
logs_alert_flo:
	docker compose  -f docker-compose.dev.yml logs -f -t --tail 0

secrets:
	@mkdir -p ./conf/secrets
	openssl rand -hex 2 > ./conf/secrets/data_pswd
	openssl rand -hex 2 > ./conf/secrets/cle_pswd
	openssl rand -hex 2 > ./conf/secrets/cle_chat
# 	openssl rand -hex 4 > ./conf/secrets/wordpress_db_password
# 	openssl rand -hex 4 > ./conf/secrets/wordpress_admin_password
# 	openssl rand -hex 4 > ./conf/secrets/wordpress_user_password
	openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./conf/secrets/nginx.key -out ./conf/secrets/nginx.crt -subj "/CN=tvoisin.42.fr"

fclean: clean
	docker volume prune -f
	docker network prune -f
	rm -r ./conf/secrets
	$(MAKE) volumes
# 	hosts_remove

re:
	@echo "⚠️ Vous devez utiliser 'make re_dev' ou 'make re_prod' !" 
	@exit 1

re_dev: fclean dev

re_prod: fclean prod

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

.PHONY: all compose down prune creat rmi volumes logs clean secrets fclean re re_dev re_prod dev prod