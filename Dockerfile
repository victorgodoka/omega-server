FROM node:22

# Instala dependências do sistema
RUN apt-get update && apt-get install -y \
  pdftk \
  build-essential \
  python3 \
  make \
  g++ \
  && apt-get clean

# Define diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências primeiro
COPY package.json package-lock.json* ./

# Instala as dependências do projeto
RUN npm install --legacy-peer-deps

# Copia o restante do código
COPY . .

# Expõe as portas
EXPOSE 3000
EXPOSE 3001
EXPOSE 27017

# Comando para iniciar o app
CMD ["npm", "start"]
