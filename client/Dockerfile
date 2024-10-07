FROM node:lts-alpine AS build
WORKDIR /client
COPY . .
RUN npm install
RUN NODE_OPTIONS=--openssl-legacy-provider npm  run build

FROM node:lts-alpine
COPY --from=build /client/dist/ /home/client/
RUN npm install -g http-server
EXPOSE 8080
CMD [ "http-server", "/home/client" ]
