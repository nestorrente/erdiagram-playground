FROM node:14-alpine as build-stage
WORKDIR /app
COPY package*.json ./
COPY lib/* ./lib/
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /app
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]