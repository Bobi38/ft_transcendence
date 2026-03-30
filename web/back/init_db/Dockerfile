FROM node:24.13.0


WORKDIR /app
COPY init_db/package*.json ./

RUN npm install

COPY init_db/ /app

COPY models/ ./models/


ENV NODE_ENV=production

CMD ["npm", "start"]
