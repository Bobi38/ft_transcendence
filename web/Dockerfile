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

#launch colyseus game server
#RUN FORCE_COLOR=0 yes 0 | npm init colyseus-app ./gameServer
#RUN npm init colyseus-app ./gameServer
#RUN cd ./gameServer && npm start &

RUN mkdir gameServer
COPY ./back/gameServer/package*.json ./gameServer
RUN cd gameServer && npm install



# Frontend

WORKDIR /app/front
COPY ./front/package*.json ./
RUN npm install


WORKDIR /app
COPY ./media ./media

WORKDIR /app/back
# Copie tout
COPY . .

EXPOSE 9000 5173 2567
CMD ["npm", "run", "dev"]



