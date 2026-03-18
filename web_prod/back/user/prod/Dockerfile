FROM node:24.13.0


WORKDIR /app
COPY ../package*.json ./



RUN npm install

COPY ../src ./src

WORKDIR /app/src
COPY ../models/index.js ./models/index.js
COPY ../models/friend.js ./models/friend.js
COPY ../models/user.js ./models/user.js

WORKDIR /app

EXPOSE 9003
CMD ["npm", "run"]
