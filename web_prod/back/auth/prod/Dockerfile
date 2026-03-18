FROM node:24.13.0


WORKDIR /app
COPY ../package*.json ./



RUN npm install

COPY ../src ./src

WORKDIR /app/src
COPY ../../models/index.js ./models/index.js
COPY ../../models/connect.js ./models/connect.js
COPY ../../models/PssWrdEmail.js ./models/PssWrdEmail.js
COPY ../../models/user.js ./models/user.js

WORKDIR /app

EXPOSE 9005
CMD ["npm", "run"]
