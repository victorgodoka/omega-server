FROM node:22

# Instalar cron
RUN apt-get update && apt-get install -y cron

# Definir o diretório de trabalho dentro do container
WORKDIR /app

# Copiar o package.json e yarn.lock para otimizar a instalação das dependências
COPY package.json /app/

# Instalar dependências do Node.js
RUN rm -rf node_modules
RUN yarn

# Copiar os outros arquivos
COPY . /app
COPY .env .env

# Adicionar o cron job
RUN echo "0 0 * * * cd /app && node migration" > /etc/cron.d/migration-cron

# Configurar permissões para o cron job
RUN chmod 0644 /etc/cron.d/migration-cron

# Ativar o cron no container
RUN crontab /etc/cron.d/migration-cron

# Expor a porta do servidor (se necessário)
EXPOSE 3000

# Iniciar o cron e o servidor
CMD cron && yarn start
