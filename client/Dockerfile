FROM node:18-alpine
WORKDIR /app/client
COPY package*.json ./
RUN npm ci --include=dev
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
