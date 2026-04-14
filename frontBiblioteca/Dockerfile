# Etapa 1: Construcción
FROM node:20.19.1-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Servidor Web (Nginx)
FROM nginx:alpine

#le decimos al index que existen mas vistas

COPY nginx.conf /etc/nginx/conf.d/default.conf 
# Asegúrate de poner la correcta abajo:
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]