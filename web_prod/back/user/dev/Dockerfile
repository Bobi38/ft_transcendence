FROM node:24.13.0


WORKDIR /app
COPY ../package*.json ./
RUN npm install


EXPOSE 9003
CMD ["npm", "run", "dev"]
