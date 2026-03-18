FROM node:24.13.0


WORKDIR /app
COPY pong3D/package*.json ./
RUN npm install

COPY pong3D/src ./src
COPY models/user.js ./models
COPY models/StatPong3D.js ./models
COPY models/GamePong3D.js ./models

WORKDIR /app

RUN apt-get update && apt-get install -y iproute2 iputils-ping && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production

EXPOSE 2567
CMD ["npm", "start"]
