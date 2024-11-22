FROM node
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
COPY ./public /app
COPY certificados/fullchain.crt /etc/ssl/ca_bundle.crt
COPY certificados/fullchain.crt /etc/ssl/certificate.crt
COPY certificados/fullchain.crt /etc/ssl/fullchain.crt
COPY certificados/private.key /etc/ssl/private/private.key
CMD ["yarn","start"]
