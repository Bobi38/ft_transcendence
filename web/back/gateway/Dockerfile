FROM node:24.13.0 AS dev


WORKDIR /app
COPY package*.json ./
RUN npm install


EXPOSE 9000
CMD ["npm", "run", "dev"]

FROM node:24.13.0 AS prod


WORKDIR /app
COPY gateway/package*.json ./

RUN npm install

COPY gateway/src/ /app


COPY models/ ./models/


ENV NODE_ENV=production

EXPOSE 9000
CMD ["npm", "start"]
