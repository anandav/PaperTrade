FROM node:lts-alpine AS buildps
WORKDIR /server
COPY . .
RUN npm install
RUN npm run build

FROM node:lts-alpine
 
COPY --from=buildps  /server/index.html /home/server/index.html
COPY --from=buildps  /server/.env /home/server/.env
COPY --from=buildps  /server/node_modules /home/server/node_modules
COPY --from=buildps  /server/dist/ /home/server
EXPOSE 9090
CMD [ "node", "--env-file=/home/server/.env", "/home/server/index.js" ]
