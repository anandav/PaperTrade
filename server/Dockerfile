FROM node:lts-alpine
WORKDIR /server
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build
EXPOSE 9090
CMD [ "node", "./dist/index.js" ]