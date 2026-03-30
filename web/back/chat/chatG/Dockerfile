FROM node:24.13.0 AS dev


WORKDIR /app
COPY package*.json ./
RUN npm install


EXPOSE 9001
CMD ["npm", "run", "dev"]

FROM node:24.13.0 AS prod


WORKDIR /app
COPY chat/chatG/package*.json ./

RUN npm install

COPY chat/chatG/src /app
COPY models/index.js ./models/index.js
COPY models/test.js ./models/test.js
COPY models/user.js ./models/user.js
COPY models/StatMorp.js ./models/StatMorp.js
COPY models/StatPong3D.js ./models/StatPong3D.js

ENV NODE_ENV=production

EXPOSE 9001
CMD ["npm", "start"]

