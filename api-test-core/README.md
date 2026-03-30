# API Test Core

A Node.js integration testing framework for APIs with built-in authentication, retry logic, and test data generation.

## Overview

- **Built with**: Node.js, SuperAgent, Mocha, Chai
- **Auth support**: JWT, API Key, Basic Auth
- **Features**: Automatic retry logic, parallel requests, test data generation

## Install

```bash
npm install
```

## Quick Start

### Write a Test

```javascript
const apiTestCore = require('./index.js');
const { posts, handleRequest, generatePostData } = apiTestCore;

describe('API Tests', () => {
  it('should create a post', async () => {
    const testPost = generatePostData();
    const response = await handleRequest(posts.create(testPost));
    
    console.log(response.status); // 201
    console.log(response.data);   // { id, title, body, userId }
  });
});
```

## Features

### Authentication

Auth is handled automatically when configured:

```javascript
// Set up auth once
apiTestCore.auth.setJwt(token);

// All subsequent requests use the token
const response = await handleRequest(posts.getAll());
```

Supported auth types: **JWT**, **API Key**, **Basic Auth**

### Test Data Generation

```javascript
const { generatePostData, generateUserData, generateEmail } = require('./index.js');

const post = generatePostData();
// { id: '...', title: '...', body: '...', userId: 1 }

const user = generateUserData({ firstName: 'John' });
// { id: '...', firstName: 'John', lastName: '...', email: '...', phone: '...' }
```

### Retry Logic

```javascript
// Retry failed requests automatically
const response = await apiTestCore.testWithRetries(3, async () => {
  return await posts.create(data);
});
```

### Parallel Requests

```javascript
const requests = [
  posts.getById(1),
  posts.getById(2),
  posts.getById(3),
];

const results = await apiTestCore.handleMultipleRequests(requests);
```

## API Adapters

| Adapter | Methods |
|---------|---------|
| `posts` | `getAll()`, `getById(id)`, `getByUser(userId)`, `create(data)`, `update(id, data)`, `patch(id, data)`, `remove(id)` |
| `users` | `getAll()`, `getById(id)`, `getByUsername(username)` |
| `comments` | `getByPost(postId)`, `create(data)` |

## Run Tests

```bash
npm install
npm test
```

## Test Results

```
  @posts API Integration Tests
    GET /posts
      ✔ should fetch all posts
      ✔ should fetch posts by user
    POST /posts
      ✔ should create a new post
      ✔ should create post with retry on failure
    ...
  @users API Integration Tests
    ✔ should fetch all users
    ✔ should fetch single user by ID
    ...

  24 passing
```

## Structure

```
api-test-core/
├── index.js              # Main entry point
├── config.js             # Configuration
├── common/
│   ├── core.js          # Request handling, retry logic
│   ├── authentication.js # JWT, API Key, Basic Auth
│   └── helper.js        # Test data generation
├── adapters/             # API adapters
│   ├── posts.js
│   ├── users.js
│   └── comments.js
└── test/                 # Framework tests
    ├── posts.test.js
    ├── users.test.js
    └── comments.test.js
```
