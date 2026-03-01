# install slim node version
FROM node:22.17.1-slim

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm","run","dev"]