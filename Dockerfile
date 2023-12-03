FROM node:latest

EXPOSE 3000

WORKDIR /app

RUN npm install -g npm@latest

COPY package.json package-lock.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]
