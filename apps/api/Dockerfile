FROM node:22-slim

RUN apt-get update && apt-get install -y openssl

WORKDIR /app

# Copy package.json and package-lock.json from the correct path
COPY apps/api/package*.json ./

RUN npm install --legacy-peer-deps

# Copy only the api source code
COPY apps/api/ ./

RUN npm run build

EXPOSE 5000

COPY apps/api/start.sh /start.sh
RUN chmod +x /start.sh

ENTRYPOINT ["/start.sh"]