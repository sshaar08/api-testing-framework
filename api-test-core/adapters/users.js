/**
 * Users Adapter
 * 
 * API adapter for Users endpoints (JSONPlaceholder)
 * 
 * Endpoints:
 * - GET /users - List all users
 * - GET /users/:id - Get single user
 */

'use strict';

const axios = require('axios');
const config = require('../config.js');

/**
 * Create configured axios instance for users
 */
const usersClient = axios.create({
  baseURL: `${config.baseUrl}/users`,
  timeout: config.requestTimeout,
  headers: config.defaultHeaders,
});

/**
 * Get all users
 * getAll :: () -> Promise
 */
async function getAll() {
  return usersClient.get('/');
}

/**
 * Get single user by ID
 * getById :: (Number) -> Promise
 * @param {number} id - User ID
 */
async function getById(id) {
  return usersClient.get(`/${id}`);
}

module.exports = {
  client: usersClient,
  getAll,
  getById,
};
