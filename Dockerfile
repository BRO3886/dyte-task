FROM node:lts-alpine

RUN apt-get update && apt-get install --no-install-recommends --yes openssl

# Working directory
WORKDIR /app

# Install dependencies
COPY *.json package-lock.json ./
RUN npm install --production
RUN cp -RL packages/backend/node_modules/ /tmp/node_modules/

# Copy source
COPY . .

# Build and cleanup
ENV NODE_ENV=production
RUN npm run build \
  && npm prune

# Start server
CMD ["npm", "start"]
