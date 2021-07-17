FROM node:14-buster-slim AS builder

RUN apt-get update && apt-get install --no-install-recommends --yes openssl

# Working directory
WORKDIR /app

# Copy files
COPY *.json ./
COPY prisma ./prisma

# Install deps
RUN npm install --production
RUN cp -RL ./node_modules/ /tmp/node_modules/

# Copy source
COPY . .

# # Build
# RUN npm --cwd ./packages/common/ build
# RUN npm --cwd ./packages/backend/ generate
# RUN npm --cwd ./packages/backend/ build


### RUNNER ###
FROM node:14-buster-slim
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist


# Build and cleanup
ENV NODE_ENV=production
RUN npm run build \
  && npm prune

# Start server
CMD ["npm","run", "start"]
