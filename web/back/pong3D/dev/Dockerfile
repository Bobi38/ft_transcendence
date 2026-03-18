FROM node:24.13.0


WORKDIR /app
COPY ../package*.json ./
RUN npm install

RUN apt-get update && apt-get install -y iproute2 iputils-ping && rm -rf /var/lib/apt/lists/*

EXPOSE 2567
CMD ["npm", "start", "dev"]
