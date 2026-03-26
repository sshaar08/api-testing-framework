# Node.js API Integration Test Image
# Built by: api-test-core team
# Purpose: Run integration tests for all services

FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies for npm packages
RUN apk add --no-cache \
    git \
    bash \
    curl \
    ca-certificates \
    && update-ca-certificates

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Configure npm to use Artifactory registry
# This allows pulling private packages from Compass Artifactory
RUN npm config set registry=https://artifacts.company.com/npm/ \
    && npm config set //artifacts.company.com/:_authToken=${ARTIFACTORY_TOKEN}

# Install pnpm and dependencies
RUN npm install -g pnpm@8
RUN pnpm install --frozen-lockfile

# Copy test source code
COPY . .

# Default command runs all integration tests
CMD ["pnpm", "run", "test:integration"]

# Labels for image metadata
LABEL maintainer="api-test-core@company.com"
LABEL description="API Integration Test Runner"
LABEL version="2.1.0"
