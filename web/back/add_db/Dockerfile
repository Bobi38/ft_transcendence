FROM node:24.13.0


WORKDIR /app
COPY add_db/package*.json ./

RUN npm install

COPY add_db/ /app

COPY models/ ./models/


ENV NODE_ENV=production

CMD ["npm", "start"]
