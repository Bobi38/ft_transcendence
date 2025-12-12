FROM node:25-alpine3.22


WORKDIR /app

COPY package*.json ./

RUN npm install

EXPOSE 9000

CMD ["npbm", "start"]
