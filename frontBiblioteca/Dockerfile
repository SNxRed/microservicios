# Etapa 1: Construcción
FROM node:20.19.1-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Servidor Web (Nginx)
FROM nginx:alpine
# Si usas Create React App, la carpeta suele ser "build". Si usas Vite, suele ser "dist".
# Asegúrate de poner la correcta abajo:
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]