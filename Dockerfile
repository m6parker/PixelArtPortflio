# ./Dockerfile
FROM node:20-alpine

WORKDIR /app

# Install production deps first
COPY package*.json ./
RUN npm ci --production

# Copy the rest of the source
COPY . .

# Ensure runtime dirs exist
RUN mkdir -p uploads

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["node", "server.js"]
