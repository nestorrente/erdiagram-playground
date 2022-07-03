FROM node:16-alpine as build-stage
WORKDIR /app
COPY package*.json ./
COPY nestorrente-erdiagram-1.0.0-rc2.tgz ./
ENV BUILD_MODE=${BUILD_MODE}
RUN echo '========== ENV START =========='
RUN env
RUN echo '========== ENV END =========='
RUN npm install
COPY . .
RUN npm run build -- --mode ${BUILD_MODE}

FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
