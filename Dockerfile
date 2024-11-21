# Use uma imagem Node.js oficial
FROM node:22

# Define o diretório de trabalho dentro do contêiner
WORKDIR /

# Copia os arquivos necessários para o contêiner
COPY package*.json ./
COPY . .

# Instala as dependências
RUN npm install

# Expõe a porta em que a aplicação será executada
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
