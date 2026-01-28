FROM node:25-bullseye

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install -g nodemon
RUN npm install mysql2
RUN npm install bcrypt
RUN npm install jsonwebtoken
RUN npm install cookie-parser
RUN npm install --save sequelize
RUN npm install ws
RUN npm install googleapis
RUN npm install express-session

COPY . .

EXPOSE 9000

CMD ["nodemon", "start"]
