FROM node:lts-alpine
WORKDIR /server
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build
EXPOSE 9090
CMD [ "node", "./dist/index.js" ]

#docker build -t anandav/papertradeapi:api .
#docker container run -d -p 9090:9090   anandav/papertradeapi:api

