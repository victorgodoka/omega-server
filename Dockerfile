FROM node:22

# Instalar dependências de compilação
RUN apt-get update && apt-get install -y \
  build-essential \
  python3 \
  make \
  g++

# Definir o diretório de trabalho dentro do container
WORKDIR /app

# Copiar o package.json e yarn.lock
COPY package.json /app/

# Instalar dependências do Node.js
RUN yarn install

# Copiar os outros arquivos
COPY . /app
COPY .env .env

# Expor a porta do servidor
EXPOSE 3000
EXPOSE 3001

# Iniciar o cron e o servidor
CMD ["yarn", "start"]
