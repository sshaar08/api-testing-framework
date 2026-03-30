/**
 * Generic Authentication Helpers
 * 
 * Provides common authentication patterns for API testing
 * Supports JWT, API Key, and Basic Auth
 */

'use strict';

const axios = require('axios');
const config = require('../config.js');

/**
 * Create axios instance for auth requests
 */
const authClient = axios.create({
  baseURL: config.baseUrl,
  timeout: config.requestTimeout,
  headers: config.defaultHeaders,
});

/**
 * Login with email/password (JWT pattern)
 * login :: (Object) -> Promise
 * 
 * @param {Object} credentials - { email, password }
 * @returns {Promise} Axios response
 */
async function login({ email, password }) {
  return authClient.post('/auth/login', {
    email,
    password,
  });
}

/**
 * Register new user
 * register :: (Object) -> Promise
 * 
 * @param {Object} userData - { email, password, firstName, lastName, ... }
 * @returns {Promise} Axios response
 */
async function register(userData) {
  return authClient.post('/auth/register', userData);
}

/**
 * Login with API key
 * loginWithApiKey :: (String) -> Promise
 * 
 * @param {string} apiKey - API key string
 * @returns {Promise} Axios response
 */
async function loginWithApiKey(apiKey) {
  return authClient.get('/auth/apikey', {
    headers: {
      'X-API-Key': apiKey,
    },
  });
}

/**
 * Login with Basic Auth
 * loginWithBasicAuth :: (String, String) -> Promise
 * 
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {Promise} Axios response
 */
async function loginWithBasicAuth(username, password) {
  const credentials = Buffer.from(`${username}:${password}`).toString('base64');
  return authClient.get('/auth/basic', {
    headers: {
      'Authorization': `Basic ${credentials}`,
    },
  });
}

/**
 * Refresh authentication token
 * refreshToken :: (String) -> Promise
 * 
 * @param {string} refreshToken - Refresh token
 * @returns {Promise} Axios response with new access token
 */
async function refreshToken(refreshToken) {
  return authClient.post('/auth/refresh', {
    refreshToken,
  });
}

/**
 * Logout/invalidate session
 * logout :: (String) -> Promise
 * 
 * @param {string} token - Auth token to invalidate
 * @returns {Promise} Axios response
 */
async function logout(token) {
  return authClient.post('/auth/logout', {}, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
}

/**
 * Delete user (admin function)
 * deleteUser :: (String, String) -> Promise
 * 
 * @param {string} userId - User ID to delete
 * @param {string} adminToken - Admin authentication token
 * @returns {Promise} Axios response
 */
async function deleteUser(userId, adminToken) {
  return authClient.delete(`/users/${userId}`, {
    headers: {
      'Authorization': `Bearer ${adminToken}`,
    },
  });
}

/**
 * Validate token is still valid
 * validateToken :: (String) -> Promise
 * 
 * @param {string} token - Token to validate
 * @returns {Promise} Axios response
 */
async function validateToken(token) {
  return authClient.get('/auth/validate', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
}

/**
 * Get current user info
 * getCurrentUser :: (String) -> Promise
 * 
 * @param {string} token - Auth token
 * @returns {Promise} Axios response with user info
 */
async function getCurrentUser(token) {
  return authClient.get('/auth/me', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
}

// For JSONPlaceholder (which doesn't have real auth), provide mock functions
/**
 * Mock login for JSONPlaceholder (demo purposes)
 * jsonPlaceholderLogin :: (Object) -> Promise
 */
async function jsonPlaceholderLogin({ email, password }) {
  // JSONPlaceholder doesn't have real auth, simulate success
  return {
    data: {
      token: `mock-jwt-token-${Date.now()}`,
      user: {
        id: 1,
        email,
        firstName: 'Test',
        lastName: 'User',
      },
    },
    status: 200,
  };
}

/**
 * Mock register for JSONPlaceholder (demo purposes)
 * jsonPlaceholderRegister :: (Object) -> Promise
 */
async function jsonPlaceholderRegister(userData) {
  return {
    data: {
      id: Math.floor(Math.random() * 1000),
      ...userData,
    },
    status: 201,
  };
}

module.exports = {
  // Standard auth patterns
  login,
  register,
  loginWithApiKey,
  loginWithBasicAuth,
  refreshToken,
  logout,
  deleteUser,
  validateToken,
  getCurrentUser,
  
  // JSONPlaceholder demo auth
  jsonPlaceholderLogin,
  jsonPlaceholderRegister,
};
