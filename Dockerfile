FROM node:7
WORKDIR /app
COPY package.json /app
ADD myTest.txt /app
ADD secondTest.txt /app
RUN npm install
COPY . /app
CMD node index.js