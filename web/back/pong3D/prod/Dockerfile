# FROM node:24.13.0


# WORKDIR /app
# COPY pong3D/package*.json ./
# RUN npm install

# COPY pong3D/src /app
# COPY models/user.js ./models/user.js
# COPY models/StatPong3D.js ./models/StatPong3D.js
# COPY models/GamePong3D.js ./models/GamePong3D.js
# COPY models/StatMorp.js ./models/StatMorp.js

# WORKDIR /app

# RUN apt-get update && apt-get install -y iproute2 iputils-ping && rm -rf /var/lib/apt/lists/*

# ENV NODE_ENV=production

# EXPOSE 2567
# CMD ["npm", "start"]


FROM node:24.13.0

# 1️⃣ Définir le répertoire de travail
WORKDIR /app

# 2️⃣ Copier package.json et package-lock.json pour installer les dépendances
COPY pong3D/package*.json ./
COPY pong3D/tsconfig.build.json ./
COPY pong3D/tsconfig.json ./
RUN npm install

# 3️⃣ Copier le code source et les modèles nécessaires
COPY pong3D/src /app/src
COPY models/user.js ./src/models/user.js
COPY models/index.js ./src/models/index.js
COPY models/StatPong3D.js ./src/models/StatPong3D.js
COPY models/GamePong3D.js ./src/models/GamePong3D.js
COPY models/StatMorp.js ./src/models/StatMorp.js

# 4️⃣ Installer outils système si besoin
RUN apt-get update && apt-get install -y iproute2 iputils-ping && rm -rf /var/lib/apt/lists/*

# 5️⃣ Builder TypeScript en JavaScript
RUN npm run build

# 6️⃣ Définir l'environnement de prod
ENV NODE_ENV=production

# 7️⃣ Exposer le port de l’application
EXPOSE 2567

# 8️⃣ Lancer Node sur le build compilé
CMD ["node", "build/index.js"]