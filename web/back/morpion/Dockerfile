FROM node:24.13.0 AS dev

WORKDIR /app


COPY morpion/package*.json ./
RUN npm install


COPY morpion/src ./src
COPY common/ws ./common/ws

EXPOSE 9004

CMD ["npm", "run", "dev"]


FROM node:24.13.0 AS prod

WORKDIR /app

COPY morpion/package*.json ./
RUN npm install --production

COPY morpion/src ./src

COPY common/ws ./common/ws

COPY models  ./src/models

ENV NODE_ENV=production

EXPOSE 9004

CMD ["node", "src/GameServ.js"]