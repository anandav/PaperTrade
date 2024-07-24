FROM node:lts-alpine
WORKDIR /client
RUN npm install -g http-server
COPY . .
RUN npm --prefix ./client install
RUN NODE_OPTIONS=--openssl-legacy-provider npm --prefix ./client run build
RUN cp -r ./client/dist/ /home/client
EXPOSE 8080
CMD [ "http-server", "/home/client" ]
