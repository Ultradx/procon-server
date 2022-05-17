FROM node:16

WORKDIR /currency_server

COPY . /currency_server

RUN npm install

RUN npm install express --save

RUN npm i --save cors express mongoose body-parser cookie-parser jsonwebtoken bcryptjs

EXPOSE 8080

ENTRYPOINT [ "node", "server.js" ]