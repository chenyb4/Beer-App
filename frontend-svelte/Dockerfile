FROM node:18.18.0-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000
EXPOSE 4173

CMD [ "npm", "run", "preview" ]