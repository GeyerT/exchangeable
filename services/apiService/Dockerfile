FROM node:14.16.1-buster-slim

WORKDIR /usr/src/_exchangeable/services/apiService

COPY package*.json ./

RUN yarn install

COPY . .

CMD ["node", "api.js"]
