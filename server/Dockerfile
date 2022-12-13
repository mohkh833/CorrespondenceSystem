FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install -g nodemon 

RUN npm install -g ts-node
RUN npm install -g typescript
RUN npm install -g pm2

COPY tsconfig.json ./

RUN npm install

COPY . . 

EXPOSE 8000 

CMD ["npm","run", "dev"]