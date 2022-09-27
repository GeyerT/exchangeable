FROM node:14.16.1-buster-slim

WORKDIR /usr/src/_exchangeable/services/blockchain

COPY package*.json ./

RUN yarn install

COPY . .

CMD ["node", "blockchain.js"]
