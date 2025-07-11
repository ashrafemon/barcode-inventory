FROM node:22-slim

WORKDIR /app

COPY apps/web/package*.json ./
RUN npm install --legacy-peer-deps

COPY apps/web/ ./
RUN npm run build

EXPOSE 3000

COPY apps/web/start.sh /start.sh
RUN chmod +x /start.sh

ENTRYPOINT ["/start.sh"]