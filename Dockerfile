#image base Node
FROM node:20

WORKDIR /app

#Copy files package and package-json
COPY package*.json ./

#Install dependency
RUN npm install

#shared port Nestjs
EXPOSE 3000
