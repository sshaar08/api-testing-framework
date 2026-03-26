# API Test Core

Core integration testing framework for API tests at Compass.

## Overview

This repository contains the Docker image and CircleCI configuration for running integration tests across all services.

## What This Does

1. **Builds** a Docker image with Node.js 18, pnpm, and all test dependencies
2. **Publishes** to Artifactory for use by all teams
3. **Runs** integration tests via CircleCI on every PR
4. **Reports** results in JUnit XML format
5. **Uploads** artifacts to S3 for the data lake

## Repository Structure

```
api-test-core/
├── docker/
│   └── Dockerfile              # Docker image definition
├── .circleci/
│   └── config.yml             # CircleCI pipeline configuration
├── src/
│   └── agents/
│       └── agents.test.ts      # Example test using @company/api-helpers
└── package.json               # Dependencies
```

## Usage

### Install the Framework

```bash
npm install @company/api-helpers
```

### Write a Test

```typescript
import { agents } from '@company/api-helpers';

await agents.create({ name: 'Test Agent' });
```

### Run Tests Locally

```bash
pnpm install
pnpm run test:integration
```

## CI/CD Pipeline

| Job | Trigger | Purpose |
|-----|---------|---------|
| smoke-tests | Every PR | Fast critical path tests |
| integration-tests | Every PR | Full test suite |
| nightly-tests | Daily | Comprehensive run |

## Ownership

- **Primary Maintainer**: Sammy Shaar (Senior SDET II)
- **Team**: Core QA
- **Slack**: #qa-infrastructure
