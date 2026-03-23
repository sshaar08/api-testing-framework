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
 * getAll :: (Object?) -> Promise
 * @param {Object} options - { params: { userId } }
 */
async function getAll(options = {}) {
  return postsClient.get('/', options);
}

/**
 * Get single post by ID
 * getById :: (Number) -> Promise
 * @param {number} id - Post ID
 */
async function getById(id) {
  return postsClient.get(`/${id}`);
}

/**
 * Get comments for a post
 * getComments :: (Number) -> Promise
 * @param {number} postId - Post ID
 */
async function getComments(postId) {
  return postsClient.get(`/${postId}/comments`);
}

/**
 * Get posts by user
 * getByUser :: (Number) -> Promise
 * @param {number} userId - User ID
 */
async function getByUser(userId) {
  return postsClient.get('/', { params: { userId } });
}

/**
 * Create new post
 * create :: (Object) -> Promise
 * @param {Object} postData - { title, body, userId }
 */
async function create(postData) {
  return postsClient.post('/', postData);
}

/**
 * Update existing post
 * update :: (Number, Object) -> Promise
 * @param {number} id - Post ID
 * @param {Object} postData - Updated post data
 */
async function update(id, postData) {
  return postsClient.put(`/${id}`, postData);
}

/**
 * Patch existing post (partial update)
 * patch :: (Number, Object) -> Promise
 * @param {number} id - Post ID  
 * @param {Object} postData - Partial post data
 */
async function patch(id, postData) {
  return postsClient.patch(`/${id}`, postData);
}

/**
 * Delete post
 * remove :: (Number) -> Promise
 * @param {number} id - Post ID
 */
async function remove(id) {
  return postsClient.delete(`/${id}`);
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
