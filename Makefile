all:	secrets compose creat

compose: 
	docker compose up -d

down: 
	docker compose down

prune: 
	docker system prune -af --volumes

volumes:
	docker volume rm $$(docker volume ls -q) 2>/dev/null || true
# 	rm -r vol

rmi:
	docker container rm -f $$(docker ps -aq) 2>/dev/null || true
	docker rmi -f $$(docker images -q) 2>/dev/null || true

clean:	down
	$(MAKE) prune
	$(MAKE) rmi

# creat:
# 	mkdir -p vol/db/data
#  	chown root:root vol/db/data
# 	chmod 755 vol/db/data

secrets:
	@mkdir -p secrets
	openssl rand -hex 4 > secrets/data_pswd
# 	openssl rand -hex 4 > secrets/wordpress_db_password
# 	openssl rand -hex 4 > secrets/wordpress_admin_password
# 	openssl rand -hex 4 > secrets/wordpress_user_password
	openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout secrets/nginx.key -out secrets/nginx.crt -subj "/CN=tvoisin.42.fr"

fclean: clean
	docker volume prune -f
	docker network prune -f
	rm -r secrets
	$(MAKE) volumes

re: fclean all


.PHONY: all compose down prune creat rmi volumes clean secrets fclean re