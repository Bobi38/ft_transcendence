FROM node:24.13.0


WORKDIR /app
COPY morpion/package*.json ./



RUN npm install

COPY morpion/src ./src

COPY models/index.js ./src/models/index.js
COPY models/GameMorpion.js ./src/models/GameMorpion.js
COPY models/StatMorpion.js ./src/models/StatMorpion.js
COPY models/user.js ./src/models/user.js

ENV NODE_ENV=production

EXPOSE 9004
CMD ["npm", "run"]
