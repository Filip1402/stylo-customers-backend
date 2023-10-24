FROM node:21

WORKDIR /src

COPY /package*.json .

RUN npm install

COPY . .

EXPOSE 3004

CMD [ "node", "./src/server.js"]