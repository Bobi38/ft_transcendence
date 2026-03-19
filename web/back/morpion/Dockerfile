FROM node:24.13.0 as dev


WORKDIR /app
COPY package*.json ./
RUN npm install


EXPOSE 9004
CMD ["npm", "run", "dev"]


FROM node:24.13.0 AS prod


WORKDIR /app
COPY morpion/package*.json ./



RUN npm install

COPY morpion/src /app

COPY models/index.js ./models/index.js
COPY models/GameMorp.js ./models/GameMorp.js
COPY models/StatMorp.js ./models/StatMorp.js
COPY models/user.js ./models/user.js
COPY models/StatPong3D.js ./models/StatPong3D.js

ENV NODE_ENV=production

EXPOSE 9004
CMD ["npm", "start"]