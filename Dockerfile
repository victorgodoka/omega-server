# Usar uma imagem base do Node.js
FROM node:18

# Diretório de trabalho dentro do contêiner
WORKDIR /app

# Copiar o package.json e yarn.lock para o diretório de trabalho
COPY package.json yarn.lock ./

# Instalar as dependências
RUN yarn install --frozen-lockfile

# Copiar o restante dos arquivos da aplicação
COPY . .

# Expor a porta que a aplicação vai rodar
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["yarn", "start"]
