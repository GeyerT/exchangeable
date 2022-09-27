FROM node:14.16.1-buster-slim

WORKDIR /usr/src/aristaios/_exchangeable/database

COPY package*.json ./

RUN yarn install

COPY . .

CMD ["node", "database.js"]
