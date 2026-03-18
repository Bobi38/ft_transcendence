FROM node:24.13.0


WORKDIR /app
COPY chat/chatG/package*.json ./

RUN npm install

COPY chat/chatG/src ./src
COPY models/index.js ./src/models/index.js
COPY models/test.js ./src/models/test.js
COPY models/user.js ./src/models/user.js

ENV NODE_ENV=production

EXPOSE 9001
CMD ["npm", "run"]
