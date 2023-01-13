FROM node:16-alpine as build-stage
WORKDIR /app
COPY package*.json ./
ARG BUILD_MODE=production
RUN npm install
COPY . .
RUN npm run build -- --mode ${BUILD_MODE}

FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
