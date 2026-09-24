# 1. build: compila l'app con Vite
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# le variabili VITE_* vengono scritte nel bundle in fase di build, non a runtime
ARG VITE_BASE_URL=http://localhost:8000/api
ENV VITE_BASE_URL=$VITE_BASE_URL

RUN npm run build

# 2. serve: solo i file statici, con nginx
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
