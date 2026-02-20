# FROM node:25-bullseye

# WORKDIR /app

# # Backend dependencies
# COPY package*.json ./
# RUN npm install

# # Frontend dependencies + code
# COPY site/go ./site/go       //PAS LES BON PATH
# WORKDIR site/go    //PAS LES BON PATH
# RUN echo "Contenu de site/go :" && ls -al    //PAS LES BON PATH
# RUN npm install 
# RUN npm run build
# RUN ls 
# WORKDIR /app

# # Copier tout le reste (backend + frontend)
# COPY . .

# EXPOSE 9000
# CMD ["npm", "start"]
# DOCKER POUR LA PRODDDDDDDDDDDDD

FROM node:24.13.0

WORKDIR /app/back

# Backend
COPY ./back/package*.json ./
RUN npm install
# RUN npm install -g nodemon
RUN npm install -g concurrently
RUN npm install vite http-proxy-middleware




# Frontend

WORKDIR /app/front
COPY ./front/package*.json ./
RUN npm install


WORKDIR /app/back
# Copie tout
COPY . .

EXPOSE 9000 5173
CMD ["npm", "run", "dev"]



