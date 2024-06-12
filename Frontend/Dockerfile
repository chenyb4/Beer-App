FROM node:22-alpine3.19

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV VITE_APIURL=127.0.0.1
ENV VITE_APIPORT=8080

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "preview", "--", "--host"]