# API Testing Core

A platform-agnostic async/await API integration testing framework for RESTful APIs. Contains core libraries and helper files to facilitate creation of API tests.

## Overview

`api-testing-core` provides a clean, reusable foundation for writing API integration tests. It abstracts away common patterns like:

- **Request handling** with consistent error management
- **Retry logic** for flaky operations
- **Parallel request execution** for test speed
- **Test data generation** utilities
- **Authentication helpers** for various auth patterns

This framework was inspired by patterns developed at scale for testing complex REST APIs and is designed to be adaptable to any REST API.

## Features

- **Async/Await First** - Modern Promise-based API
- **Request Helpers** - `handleRequest`, `handleMultipleRequests`, `testWithRetries`
- **Data Generation** - Generate test users, posts, comments, UUIDs
- **Adapter Pattern** - Clean separation of API client logic
- **Configurable** - Environment-based configuration with `.env` support
- **Framework Agnostic** - Works with Mocha, Jest, or any test runner

## Installation

```bash
npm install api-testing-core
```

Or with pnpm:

```bash
pnpm add api-testing-core
```

## Quick Start

```javascript
const core = require('api-testing-core');
const { generatePostData } = require('api-testing-core/common/helper');

// Create API client
const client = core.getApiClient();

// Simple request with error handling
const response = await core.handleRequest(
  client.get('/posts/1'),
  'Failed to fetch post'
);

console.log(response.data);
```

## Architecture

### Core Components

| File | Purpose |
|------|---------|
| `core.js` | Main testing library - request handling, retries, parallel execution |
| `helper.js` | Utility functions - UUID generation, data factories, randomizers |
| `authentication.js` | Auth patterns - JWT, API Key, Basic Auth helpers |
| `config.js` | Configuration management with environment variables |

### Adapter Pattern

Adapters provide a clean abstraction layer for your API endpoints:

```javascript
// adapters/posts.js
const postsAdapter = {
  getAll: () => client.get('/posts'),
  getById: (id) => client.get(`/posts/${id}`),
  create: (data) => client.post('/posts', data),
  update: (id, data) => client.put(`/posts/${id}`, data),
  delete: (id) => client.delete(`/posts/${id}`),
};
```

## Configuration

Create a `.env` file in your project root:

```env
# API Configuration
API_BASE_URL=https://jsonplaceholder.typicode.com
REQUEST_TIMEOUT=30000

# Authentication (optional)
API_KEY=your-api-key
AUTH_TOKEN=your-auth-token

# Retry Configuration  
RETRY_ATTEMPTS=3
RETRY_DELAY=1000
```

### Available Config Options

| Variable | Default | Description |
|----------|---------|-------------|
| `API_BASE_URL` | `https://jsonplaceholder.typicode.com` | Base URL for API |
| `REQUEST_TIMEOUT` | `30000` | Request timeout in ms |
| `RETRY_ATTEMPTS` | `3` | Number of retry attempts |
| `RETRY_DELAY` | `1000` | Base delay between retries |
| `API_KEY` | - | API key for authentication |
| `AUTH_TOKEN` | - | Bearer token for authentication |

## Usage Examples

### Basic CRUD Test

```javascript
const { describe, it } = require('mocha');
const { expect } = require('chai');
const core = require('api-testing-core');
const postsAdapter = require('./adapters/posts');
const helper = require('./common/helper');

describe('Posts API', () => {
  it('should create and retrieve a post', async () => {
    // Create
    const postData = helper.generatePostData();
    const createResponse = await core.handleRequest(
      postsAdapter.create(postData),
      'Failed to create post'
    );
    
    expect(createResponse.status).to.equal(201);
    
    // Retrieve
    const getResponse = await core.handleRequest(
      postsAdapter.getById(createResponse.data.id),
      'Failed to fetch post'
    );
    
    expect(getResponse.data.title).to.equal(postData.title);
  });
});
```

### Retry on Flaky Operations

```javascript
// Retry with custom wait times
const result = await core.testWithRetries(5, async () => {
  return await fragileApiCall();
}, [1000, 2000, 4000, 8000]); // Exponential backoff
```

### Parallel Requests

```javascript
// Execute multiple requests concurrently
const requests = [
  postsAdapter.getById(1),
  postsAdapter.getById(2),
  postsAdapter.getById(3),
];

const results = await core.handleMultipleRequests(requests);
```

### Test Data Generation

```javascript
const helper = require('api-testing-core/common/helper');

// Generate random data
const user = helper.generateUserData();
const post = helper.generatePostData();
const comment = helper.generateCommentData();
const email = helper.generateEmail('testuser');
const uuid = helper.guid();
```

## Adding New API Adapters

Create a new adapter file in the `adapters/` directory:

```javascript
// adapters/your-api.js
const axios = require('axios');
const config = require('../config.js');

const apiClient = axios.create({
  baseURL: `${config.baseUrl}/your-endpoint`,
  timeout: config.requestTimeout,
});

module.exports = {
  getAll: () => apiClient.get('/'),
  getById: (id) => apiClient.get(`/${id}`),
  create: (data) => apiClient.post('/', data),
  update: (id, data) => apiClient.put(`/${id}`, data),
  delete: (id) => apiClient.delete(`/${id}`),
};
```

## Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- test/posts.test.js

# Run with custom base URL
API_BASE_URL=https://api.yourdomain.com npm test
```

## Example Tests

This package includes example tests using JSONPlaceholder API in the `test/` directory:

- `test/posts.test.js` - Posts CRUD operations
- `test/users.test.js` - Users API tests
- `test/comments.test.js` - Comments API tests

## Comparison to Alternatives

| Feature | api-testing-core | Supertest | Jest + MSW |
|---------|------------------|-----------|------------|
| HTTP Client | axios | supertest | Mocked |
| Built-in Retry | ✅ | ❌ | ❌ |
| Parallel Execution | ✅ | ❌ | Mocked |
| Test Data Gen | ✅ | ❌ | ❌ |
| Adapter Pattern | ✅ | ❌ | ❌ |
| Framework | Any | Express | Any |

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
