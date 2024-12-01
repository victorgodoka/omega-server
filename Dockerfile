FROM node:22
WORKDIR /app
COPY package.json /app
RUN yarn
COPY . /app
COPY .env .env
CMD ["yarn","start"]
