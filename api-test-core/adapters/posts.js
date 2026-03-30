/**
 * Posts Adapter
 * 
 * API adapter for Posts endpoints (JSONPlaceholder)
 * Demonstrates the adapter pattern for API testing
 * 
 * Endpoints:
 * - GET /posts - List all posts
 * - GET /posts/:id - Get single post
 * - GET /posts/:id/comments - Get post comments
 * - GET /posts?userId=:id - Get posts by user
 * - POST /posts - Create post
 * - PUT /posts/:id - Update post
 * - DELETE /posts/:id - Delete post
 */

'use strict';

const axios = require('axios');
const config = require('../config.js');

/**
 * Create configured axios instance for posts
 */
const postsClient = axios.create({
  baseURL: `${config.baseUrl}/posts`,
  timeout: config.requestTimeout,
  headers: config.defaultHeaders,
});

/**
 * Get all posts
 * getAll :: (Object?, Object?) -> Promise
 * @param {Object} params - { userId } query params
 * @param {Object} headers - Optional auth headers
 */
async function getAll(params = {}, headers = {}) {
  return postsClient.get('/', { params, ...headers });
}

/**
 * Get single post by ID
 * getById :: (Number, Object?) -> Promise
 * @param {number} id - Post ID
 * @param {Object} headers - Optional auth headers
 */
async function getById(id, headers = {}) {
  return postsClient.get(`/${id}`, headers);
}

/**
 * Get comments for a post
 * getComments :: (Number, Object?) -> Promise
 * @param {number} postId - Post ID
 * @param {Object} headers - Optional auth headers
 */
async function getComments(postId, headers = {}) {
  return postsClient.get(`/${postId}/comments`, headers);
}

/**
 * Get posts by user
 * getByUser :: (Number, Object?) -> Promise
 * @param {number} userId - User ID
 * @param {Object} headers - Optional auth headers
 */
async function getByUser(userId, headers = {}) {
  return postsClient.get('/', { params: { userId }, ...headers });
}

/**
 * Create new post
 * create :: (Object, Object?) -> Promise
 * @param {Object} postData - { title, body, userId }
 * @param {Object} headers - Optional auth headers
 */
async function create(postData, headers = {}) {
  return postsClient.post('/', postData, headers);
}

/**
 * Update existing post
 * update :: (Number, Object, Object?) -> Promise
 * @param {number} id - Post ID
 * @param {Object} postData - Updated post data
 * @param {Object} headers - Optional auth headers
 */
async function update(id, postData, headers = {}) {
  return postsClient.put(`/${id}`, postData, headers);
}

/**
 * Patch existing post (partial update)
 * patch :: (Number, Object, Object?) -> Promise
 * @param {number} id - Post ID  
 * @param {Object} postData - Partial post data
 * @param {Object} headers - Optional auth headers
 */
async function patch(id, postData, headers = {}) {
  return postsClient.patch(`/${id}`, postData, headers);
}

/**
 * Delete post
 * remove :: (Number, Object?) -> Promise
 * @param {number} id - Post ID
 * @param {Object} headers - Optional auth headers
 */
async function remove(id, headers = {}) {
  return postsClient.delete(`/${id}`, headers);
}

module.exports = {
  client: postsClient,
  getAll,
  getById,
  getComments,
  getByUser,
  create,
  update,
  patch,
  remove,
};
