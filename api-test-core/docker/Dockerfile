# ==============================================================================
# Node.js API Integration Test Image
# Built by: api-test-core team
# Purpose: Run integration tests for all services
#
# IMPORTANT: This image does NOT contain npm packages
# - npm packages are pulled at RUNTIME from Artifactory
# - This allows the SAME image to be used by all teams
# - Each team pulls their own version of @company/api-helpers
#
# Image stored in: Nexus (Platform team managed)
# npm packages stored in: Artifactory
# ==============================================================================

FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install basic tools
RUN apk add --no-cache \
    git \
    bash \
    curl \
    ca-certificates \
    && update-ca-certificates

# Install pnpm globally
RUN npm install -g pnpm@8

# ==============================================================================
# NOTE: npm packages are NOT installed here
# 
# Instead, at RUNTIME:
# 1. CircleCI pulls this image from Nexus
# 2. CircleCI configures npm to use Artifactory
# 3. Container runs `pnpm install` to pull packages
# 4. Tests run with the pulled packages
#
# This allows sharing ONE image across all teams
# while each team uses their own package versions
# ==============================================================================

# Copy test source code (no node_modules)
COPY src/ ./src/
COPY package.json ./

# Default command (packages pulled at runtime)
CMD ["pnpm", "run", "test:integration"]

# Labels for image metadata
LABEL maintainer="api-test-core@company.com"
LABEL description="API Integration Test Runner - Runtime npm package pulling"
LABEL version="2.1.0"
