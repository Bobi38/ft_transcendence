FROM node:24.13.0


WORKDIR /app
COPY gateway/package*.json ./



RUN npm install

COPY gateway/src ./src


COPY /models/ ./src/models/


ENV NODE_ENV=production

EXPOSE 9000
CMD ["npm", "run"]
