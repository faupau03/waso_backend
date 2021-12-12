# WaSo Backend
Wastel Software Rest API

Welcome to the WaSo project backend server.
This service provides a rest api including the handling of authentication.

This is my first github project.

Installation:
 
 1. Install node.js and git
 `apt install nodejs git -y`
 2. Clone this repository
 `git clone https://github.com/faupau03/waso_backend`
 3. Change directory to folder
 `cd waso_backend`
 4. Install dependencies
 `npm install`
 5. Start server
 `npm start`

The docker way:
 
 1. Install docker and docker-compose
    There are many how tos online
 2. Create an directory
    `mkdir waso_backend`
 3. Create Dockerfile
    `nano Dockerfile`
 4. Paste the following content
```    
FROM node:latest
RUN apt update -y && apt install git -y
RUN git clone https://github.com/faupau03/waso_backend

WORKDIR waso_backend

RUN npm install

EXPOSE $PORT
CMD npm start
```

  4. Create another file named docker-compose.yml with the following content
```
version: "3"
 services:
   backend:
     build: .
     environment:
       DB_HOST: db
       DB_PORT: 5432
       DB_NAME: waso
       DB_USER: postgres
       DB_PASSWORD: YourSecretPassword
       SESSION_SECRET: YourSecretSecret
     ports:
       - "3000:3000"
     restart: unless-stopped
   db:
     image: postgres
     restart: always
     environment:
       POSTGRES_USER: postgres
       POSTGRES_PASSWORD: YOUR_SECRET_SECRET
       PGDATA: /data/postgresql
       POSTGRES_DB: waso
     volumes:
       - ./postgresql:/data/postgresql
```
  5. Start the services
  `docker-compose up -d`
  6. The api will be available at port 3000
