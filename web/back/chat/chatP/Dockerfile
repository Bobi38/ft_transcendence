FROM node:24.13.0


WORKDIR /app
COPY package*.json ./\
RUN npm install

COPY . .

EXPOSE 9002
CMD ["npm", "run", "dev"]
