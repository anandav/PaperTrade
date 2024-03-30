FROM node:lts-alpine
WORKDIR /client
RUN npm install -g http-server
COPY package*.json .
COPY . .
RUN npm --prefix ./client install
RUN npm --openssl-legacy-provider --prefix ./client run build
EXPOSE 8080
CMD [ "http-server", "dist" ]
