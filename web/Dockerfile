FROM node:25-bullseye

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install -g nodemon
RUN npm install mysql2


COPY . .

EXPOSE 9000

CMD ["nodemon", "start"]
