FROM node:lts-alpine

RUN apt-get update && apt-get install --no-install-recommends --yes openssl

# Working directory
WORKDIR /app

# Install dependencies
COPY *.json package-lock.json ./

# Copy source
COPY . .

# Build and cleanup
ENV NODE_ENV=production
RUN npm run build \
  && npm prune

# Start server
CMD ["npx prisma mi","npm", "start", ]
