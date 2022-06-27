# Taken form  https://v2.vuejs.org/v2/cookbook/dockerize-vuejs-app.html

FROM node:lts-alpine
RUN npm install -g http-server
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 8080
CMD [ "http-server", "public" ]

# docker build -t anandav/papertrade .
# docker run -it -p 8080:8080 --rm --name papertrade  anandav/papertrade