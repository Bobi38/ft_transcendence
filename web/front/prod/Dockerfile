FROM node:24.13.0 AS builder

WORKDIR /app

# Copier seulement package.json et package-lock.json pour installer les dépendances
COPY package*.json ./
RUN npm install

# Copier le code source
COPY . .

# Builder le front
RUN npm run build

# Étape 2 : container léger pour servir les fichiers statiques
FROM nginx:alpine

# Copier le build final
COPY --from=builder /app/dist /usr/share/nginx/html

# Exposer le port 80 pour Nginx
EXPOSE 80

# Lancer Nginx
CMD ["nginx", "-g", "daemon off;"]