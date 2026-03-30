/**
 * API Testing Core Library
 * 
 * Platform-agnostic async/await library for testing RESTful APIs
 * Provides common functionality for API integration tests
 * 
 * Key Features:
 * - Request handling with error management
 * - Retry logic for flaky operations
 * - Parallel request execution
 * - Token/API key management
 * - Test data generation
 */

'use strict';

const axios = require('axios');
const { assert, expect } = require('chai');
const config = require('../config.js');
const helper = require('./helper.js');
const auth = require('./authentication.js');

// Default retry wait times (in ms)
const DEFAULT_WAIT_TIMES = [300, 600, 1200, 2400, 3000];

/**
 * Create axios instance with default configuration
 * @returns {axios.AxiosInstance} Configured axios instance
 */
function createApiClient() {
  const client = axios.create({
    baseURL: config.baseUrl,
    timeout: config.requestTimeout,
    headers: {
      ...config.defaultHeaders,
    },
  });
  
  return client;
}

// Global API client instance
let apiClient = createApiClient();

/**
 * Reset/recreate API client
 * Useful when config changes
 */
function resetApiClient() {
  apiClient = createApiClient();
}

/**
 * Handle HTTP request with error handling
 * handleRequest :: (Promise, String) -> Promise
 * 
 * @param {Promise} request - Axios request promise
 * @param {string} errorMessage - Custom error message
 * @returns {Promise} Request result
 * @throws {Error} Error with detailed message
 */
async function handleRequest(request, errorMessage = 'Request failed') {
  let result;
  try {
    result = await request;
  } catch (reason) {
    let errorDetails = '';
    
    if (reason.response) {
      // Server responded with error status
      errorDetails = `
        Status: ${reason.response.status}
        URL: ${reason.config?.url || 'unknown'}
        Method: ${reason.config?.method || 'unknown'}
        Response: ${JSON.stringify(reason.response.data, null, 2)}
      `;
    } else if (reason.request) {
      // Request was made but no response
      errorDetails = `
        URL: ${reason.config?.url || 'unknown'}
        Method: ${reason.config?.method || 'unknown'}
        No response received (network error or timeout)
      `;
    } else {
      // Error setting up request
      errorDetails = reason.message;
    }
    
    throw new Error(`${errorMessage}\n${errorDetails}`);
  }
  return result;
}

/**
 * Handle multiple requests in parallel
 * handleMultipleRequests :: (Array[Promise], String?) -> Promise
 * 
 * @param {Array} functionsToExec - Array of request promises
 * @param {string} errorMessage - Optional custom error message
 * @returns {Promise} Array of results
 * @throws {Error} Error if any request fails
 */
async function handleMultipleRequests(functionsToExec, errorMessage = null) {
  let results;
  try {
    results = await Promise.all(functionsToExec);
  } catch (e) {
    if (errorMessage) {
      throw new Error(`${errorMessage}\n${e.message}`);
    } else {
      throw new Error(e.message);
    }
  }
  return results;
}

/**
 * Handle multiple requests without failing on individual errors
 * Useful for cleanup operations where all attempts should be made
 * 
 * @param {Array} functionsToExec - Array of request promises
 * @returns {Promise} Array of results (some may be errors)
 */
async function handleMultipleRequestsDelegateErrors(functionsToExec) {
  let results;
  try {
    results = await Promise.all(functionsToExec);
  } catch (e) {
    console.log('Error handling one of the array of requests:', e.message);
    // Return what we got, ignore the error
  }
  return results;
}

/**
 * Retry a function with exponential backoff
 * testWithRetries :: (Number, Function, Array?) -> Promise
 * 
 * @param {number} retries - Number of retry attempts
 * @param {Function} fn - Function to execute
 * @param {Array} waits - Array of wait times in ms (default: [300, 600, 1200, 2400, 3000])
 * @returns {Promise} Function result
 * @throws {Error} Error after all retries exhausted
 */
async function testWithRetries(retries, fn, waits = DEFAULT_WAIT_TIMES) {
  let attempts = 0;
  
  // eslint-disable-next-line no-constant-condition
  do {
    try {
      return await fn();
    } catch (e) {
      if (!retries || attempts >= retries) {
        throw e;
      }
      
      const waitTime = attempts >= waits.length 
        ? waits[waits.length - 1] 
        : waits[attempts];
      
      console.log(`\tRetry attempt ${attempts + 1}, waiting ${waitTime}ms...`);
      await sleep(waitTime);
      ++attempts;
    }
  } while (attempts <= retries);
  
  throw new Error('All retry attempts exhausted');
}

/**
 * Sleep/wait for specified milliseconds
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} Promise that resolves after delay
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Create API request options with authentication
 * apiOptionsFactory :: (Object) -> Object
 * 
 * @param {string} token - API token or API key
 * @param {string} baseURL - Optional base URL override
 * @returns {Object} Options object for axios
 */
function apiOptionsFactory({ token, baseURL = config.baseUrl }) {
  return {
    baseURL,
    headers: token 
      ? { Authorization: `Bearer ${token}` }
      : {},
  };
}

/**
 * Convert token to authorization header
 * @param {string} token - Token string
 * @returns {Object} Header object
 */
function token2Header({ token }) {
  return {
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Create authenticated user session
 * authenticateUser :: (String, String) -> Promise
 * 
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} Authenticated user session object
 */
async function authenticateUser(email, password) {
  const userPayload = {
    email,
    password,
  };
  
  const authResponse = await handleRequest(
    auth.login(userPayload),
    'Failed to authenticate user'
  );
  
  return {
    token: authResponse.data?.token || authResponse.data?.access_token,
    user: authResponse.data?.user || authResponse.data,
    rawResponse: authResponse.data,
  };
}

/**
 * Create test user account
 * createTestUser :: (Object) -> Promise
 * 
 * @param {Object} userData - User data (email, firstName, lastName, etc.)
 * @returns {Promise} Created user object
 */
async function createTestUser(userData = {}) {
  const defaults = {
    email: helper.generateEmail('testuser'),
    firstName: helper.generateName('first'),
    lastName: helper.generateName('last'),
    password: 'TestPassword123!',
  };
  
  const payload = { ...defaults, ...userData };
  
  const response = await handleRequest(
    auth.register(payload),
    'Failed to create test user'
  );
  
  return {
    ...response.data,
    email: payload.email,
  };
}

/**
 * Delete test user/account
 * deleteTestUser :: (String, String) -> Promise
 * 
 * @param {string} userId - User ID to delete
 * @param {string} token - Admin/Super user token
 * @returns {Promise} Deletion result
 */
async function deleteTestUser(userId, token) {
  const response = await handleRequest(
    auth.deleteUser(userId, token),
    'Failed to delete test user'
  );
  
  return response.data;
}

/**
 * Assert response status code
 * assertStatusCode :: (Response, Number, String?) -> void
 * 
 * @param {Object} response - Axios response
 * @param {number} expectedStatus - Expected status code
 * @param {string} customMessage - Optional custom error message
 */
function assertStatusCode(response, expectedStatus, customMessage = null) {
  const actualStatus = response.status;
  const message = customMessage || 
    `Expected status ${expectedStatus} but got ${actualStatus}`;
  
  assert.strictEqual(actualStatus, expectedStatus, message);
}

/**
 * Assert response body contains key
 * assertBodyContains :: (Object, String, Any) -> void
 * 
 * @param {Object} body - Response body
 * @param {string} key - Key to check
 * @param {*} value - Expected value
 */
function assertBodyContains(body, key, value) {
  if (value !== undefined) {
    expect(body).to.have.property(key, value);
  } else {
    expect(body).to.have.property(key);
  }
}

/**
 * Pretty print JSON to console
 * prettyPrint :: (Object) -> void
 * 
 * @param {Object} obj - Object to print
 */
function prettyPrint(obj) {
  console.log(JSON.stringify(obj, null, 2));
}

/**
 * Get current API client instance
 * @returns {axios.AxiosInstance} Current API client
 */
function getApiClient() {
  return apiClient;
}

/**
 * Set custom API client
 * @param {axios.AxiosInstance} client - Custom axios instance
 */
function setApiClient(client) {
  apiClient = client;
}

module.exports = {
  // Core functions
  handleRequest,
  handleMultipleRequests,
  handleMultipleRequestsDelegateErrors,
  testWithRetries,
  sleep,
  
  // API client management
  apiClient,
  createApiClient,
  resetApiClient,
  getApiClient,
  setApiClient,
  
  // Request factories
  apiOptionsFactory,
  token2Header,
  
  // User management
  authenticateUser,
  createTestUser,
  deleteTestUser,
  
  // Assertions
  assertStatusCode,
  assertBodyContains,
  
  // Utilities
  prettyPrint,
};
