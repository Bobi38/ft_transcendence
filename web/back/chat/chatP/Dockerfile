FROM node:24.13.0 AS prod


WORKDIR /app
COPY chat/chatP/package*.json ./

RUN npm install

COPY chat/chatP/src /app

COPY models/index.js ./models/index.js
COPY models/privchat.js ./models/privchat.js
COPY models/privmess.js ./models/privmess.js
COPY models/user.js ./models/user.js
COPY models/StatMorp.js ./models/StatMorp.js
COPY models/StatPong3D.js ./models/StatPong3D.js

ENV NODE_ENV=production

EXPOSE 9002
CMD ["npm", "start"]

FROM node:24.13.0 AS dev


WORKDIR /app
COPY package*.json ./
RUN npm install


EXPOSE 9002
CMD ["npm", "run", "dev"]