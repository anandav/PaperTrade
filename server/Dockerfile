FROM node:lts-alpine
WORKDIR /app
#COPY package*.json .
COPY . .
RUN npm --prefix ./server install
RUN npm --prefix ./server run build
RUN npm --prefix ./server run cleanup
#RUN npm run build
EXPOSE 9090
CMD [ "node", "./index.js" ]
