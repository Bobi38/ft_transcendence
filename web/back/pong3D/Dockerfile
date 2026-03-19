FROM node:24.13.0 AS dev


WORKDIR /app
COPY package*.json ./
RUN npm install

RUN apt-get update && apt-get install -y iproute2 iputils-ping && rm -rf /var/lib/apt/lists/*

EXPOSE 2567
CMD ["npm", "run", "dev"]

FROM node:24.13.0 AS prod


WORKDIR /app

COPY pong3D/package*.json ./
COPY pong3D/tsconfig.build.json ./
COPY pong3D/tsconfig.json ./
RUN npm install

COPY pong3D/src /app/src
COPY models/user.js ./src/models/user.js
COPY models/index.js ./src/models/index.js
COPY models/StatPong3D.js ./src/models/StatPong3D.js
COPY models/GamePong3D.js ./src/models/GamePong3D.js
COPY models/StatMorp.js ./src/models/StatMorp.js


RUN apt-get update && apt-get install -y iproute2 iputils-ping && rm -rf /var/lib/apt/lists/*

RUN npm run build

ENV NODE_ENV=production

EXPOSE 2567

CMD ["node", "build/index.js"]

