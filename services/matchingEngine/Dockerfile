FROM node:14.16.1-buster-slim

WORKDIR /usr/src/aristaios/_exchangeable/matchingEngine

COPY package*.json ./

RUN yarn install

COPY . .

CMD ["node", "matchingEngine.js"]
