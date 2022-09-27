FROM node:14.16.1-buster-slim

WORKDIR /usr/src/_exchangeable/server

COPY package*.json ./

RUN yarn install

COPY . .

CMD ["node", "brain.js"]
