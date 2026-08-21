FROM node:20-alpine AS builder

WORKDIR /app

RUN addgroup -g 1001 -S nodejs
RUN adduser -S server -u 1001

RUN apk add --no-cache openssl

COPY package.json package-lock.json* ./
COPY prisma/ prisma/
RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

USER server
EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]