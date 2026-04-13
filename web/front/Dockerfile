FROM node:24.13.0 AS dev

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]


FROM node:24.13.0 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG VITE_GOOGLE_ID_CLIENT
# ⚡ Injection au build pour Vite
ENV VITE_GOOGLE_ID_CLIENT=$VITE_GOOGLE_ID_CLIENT
RUN npm run build

# Production
FROM nginx:alpine AS prod
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/media /usr/share/nginx/html/media/
COPY prod/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]