FROM node:lts-alpine AS build
WORKDIR /client
COPY . .
ARG API_URL=http://localhost:9090/
ARG BUILD_SHA=dev
ARG APP_VERSION=
ENV API_URL=$API_URL
ENV BUILD_SHA=$BUILD_SHA
ENV APP_VERSION=$APP_VERSION
RUN npm install
RUN npm run build

FROM node:lts-alpine
COPY --from=build /client/dist/ /home/client/
RUN npm install -g http-server
EXPOSE 8080
CMD [ "http-server", "/home/client", "--history-api-fallback" ]
