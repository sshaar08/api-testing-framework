# API Testing Framework

A Node.js integration testing framework with CI/CD pipeline for API testing.

## Overview

This monorepo contains:
- **api-test-core** - The npm package for writing API tests
- **demo** - Demo app showing how to import and use the package
- **Infrastructure** - Docker, CircleCI, GitHub Actions

## Quick Start

### Install the Package

```bash
cd api-test-core
npm install
```

### Write a Test

```javascript
const apiTestCore = require('api-test-core');
const { posts, handleRequest, generatePostData } = apiTestCore;

describe('API Tests', () => {
  it('should create a post', async () => {
    const testPost = generatePostData();
    const response = await handleRequest(posts.create(testPost));
    console.log(response.status); // 201
  });
});
```

### Run Tests

```bash
# Framework tests
cd api-test-core && npm test
# Result: 24 passing

# Demo (shows package import)
cd demo && npm test
# Result: 4 passing
```

## Repository Structure

```
api-testing-framework/
├── api-test-core/           # The npm package
│   ├── index.js            # Main entry point
│   ├── common/
│   │   ├── core.js        # Request handling, retry logic
│   │   ├── authentication.js  # JWT, API Key, Basic Auth
│   │   └── helper.js      # Test data generation
│   ├── adapters/           # API adapters (posts, users, comments)
│   ├── test/              # Framework tests (24 passing)
│   └── docker/             # Docker image definition
├── demo/                   # Demo app
│   └── test/
│       └── demo.test.js   # Shows package import (4 passing)
├── .circleci/              # CircleCI pipeline config
├── .github/workflows/      # GitHub Actions
└── .gitignore
```

## Features

| Feature | Description |
|---------|-------------|
| **Auth Support** | JWT, API Key, Basic Auth |
| **Test Data** | Auto-generate users, posts, comments |
| **Retry Logic** | Automatic retry on failure |
| **Parallel Requests** | Batch multiple requests |
| **Adapters** | Posts, Users, Comments APIs |

## CI/CD Pipeline

| Job | Trigger | Purpose |
|-----|---------|---------|
| smoke-tests | Every PR | Fast critical path tests |
| integration-tests | Every PR | Full test suite |
| nightly-tests | Daily | Comprehensive run |

## Key Files

| Component | File |
|----------|------|
| Framework | [api-test-core/index.js](api-test-core/index.js) |
| Auth | [api-test-core/common/authentication.js](api-test-core/common/authentication.js) |
| Helpers | [api-test-core/common/helper.js](api-test-core/common/helper.js) |
| Adapters | [api-test-core/adapters/](api-test-core/adapters/) |
| Docker | [api-test-core/docker/Dockerfile](api-test-core/docker/Dockerfile) |
| CircleCI | [.circleci/config.yml](.circleci/config.yml) |
| GitHub Actions | [.github/workflows/pr-label-trigger.yml](.github/workflows/pr-label-trigger.yml) |

## License

Internal use - Compass
