FROM node:18-alpine

WORKDIR /app/server
COPY package*.json .

RUN npm ci --include=dev
COPY . .

EXPOSE 5001
CMD ["npm", "run", "dev"]