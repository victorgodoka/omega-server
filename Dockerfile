FROM node:22

RUN apt-get update && apt-get install -y \
  pdftk \
  build-essential \
  python3 \
  make \
  g++ \
  curl \
  && apt-get clean

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

COPY . .

RUN mkdir -p data && \
  curl -L https://github.com/duelists-unite/omega-3/releases/download/data/omega.db -o data/omega.db

EXPOSE 3000
CMD ["npm", "start"]
