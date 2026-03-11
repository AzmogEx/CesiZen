FROM node:20-alpine

WORKDIR /app

# Dépendances d'abord (cache Docker)
COPY package.json package-lock.json* ./
RUN npm install

# Copier le reste du code
COPY . .

EXPOSE 3000

ENV HOSTNAME=0.0.0.0

CMD ["npm", "run", "dev"]
