FROM node:24.13.0


WORKDIR /app
COPY auth/package*.json ./



RUN npm install

COPY auth/src /app

COPY models/index.js ./models/index.js
COPY models/connect.js ./models/connect.js
COPY models/PssWrdEmail.js ./models/PssWrdEmail.js
COPY models/user.js ./models/user.js
COPY models/StatMorp.js ./models/StatMorp.js
COPY models/StatPong3D.js ./models/StatPong3D.js

ENV NODE_ENV=production

EXPOSE 9005
CMD ["npm", "start"]
