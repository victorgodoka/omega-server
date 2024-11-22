FROM node
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
COPY ./public /app
CMD ["yarn","start"]
