FROM node:22-alpine3.19

RUN apk add --no-cache vim

RUN apk add --no-cache postgresql-client

RUN apk update && apk upgrade postgresql-client

RUN apk add --no-cache bash

COPY . .

WORKDIR .

RUN npm install

RUN chmod 0600 ./.pgpass