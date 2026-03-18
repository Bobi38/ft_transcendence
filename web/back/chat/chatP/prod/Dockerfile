FROM node:24.13.0


WORKDIR /app
COPY chat/chatP/package*.json ./

RUN npm install

COPY chat/chatP/src ./src

COPY models/index.js ./src/models/index.js
COPY models/privchat.js ./src/models/privchat.js
COPY models/privmess.js ./src/models/privmess.js
COPY models/user.js ./src/models/user.js

ENV NODE_ENV=production

EXPOSE 9002
CMD ["npm", "run"]
