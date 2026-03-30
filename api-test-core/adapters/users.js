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
 * getAll :: (Object?) -> Promise
 * @param {Object} headers - Optional auth headers
 */
async function getAll(headers = {}) {
  return usersClient.get('/', headers);
}

/**
 * Get single user by ID
 * getById :: (Number, Object?) -> Promise
 * @param {number} id - User ID
 * @param {Object} headers - Optional auth headers
 */
async function getById(id, headers = {}) {
  return usersClient.get(`/${id}`, headers);
}

module.exports = {
  client: usersClient,
  getAll,
  getById,
};
