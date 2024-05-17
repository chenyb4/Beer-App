FROM node:12-alpine3.14


# Setting up the work directory
WORKDIR /usr/src/app

# Copying all the files in our project
COPY . .

# Installing dependencies
RUN npm install

# Exposing server port
EXPOSE 80