FROM node:24.13.0


WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 2567
CMD ["npm", "start"]
#use CMD ["node", "build/index.js"] pour prod
