FROM node:24.13.0


WORKDIR /app
COPY user/package*.json ./



RUN npm install

COPY user/src ./src

COPY models/index.js ./src/models/index.js
COPY models/friend.js ./src/models/friend.js
COPY models/user.js ./src/models/user.js

ENV NODE_ENV=production

EXPOSE 9003
CMD ["npm", "run"]
