/**
 * Comments Adapter
 * 
 * API adapter for Comments endpoints (JSONPlaceholder)
 * 
 * Endpoints:
 * - GET /comments - List all comments
 * - GET /comments?postId=:id - Get comments by post
 * - GET /comments/:id - Get single comment
 * - POST /comments - Create comment
 */

'use strict';

const axios = require('axios');
const config = require('../config.js');

/**
 * Create configured axios instance for comments
 */
const commentsClient = axios.create({
  baseURL: `${config.baseUrl}/comments`,
  timeout: config.requestTimeout,
  headers: config.defaultHeaders,
});

/**
 * Get all comments
 * getAll :: (Object?) -> Promise
 * @param {Object} headers - Optional auth headers
 */
async function getAll(headers = {}) {
  return commentsClient.get('/', headers);
}

/**
 * Get comments for a post
 * getByPost :: (Number, Object?) -> Promise
 * @param {number} postId - Post ID
 * @param {Object} headers - Optional auth headers
 */
async function getByPost(postId, headers = {}) {
  return commentsClient.get('/', { params: { postId }, ...headers });
}

/**
 * Get single comment by ID
 * getById :: (Number, Object?) -> Promise
 * @param {number} id - Comment ID
 * @param {Object} headers - Optional auth headers
 */
async function getById(id, headers = {}) {
  return commentsClient.get(`/${id}`, headers);
}

/**
 * Create new comment
 * create :: (Object, Object?) -> Promise
 * @param {Object} commentData - { name, email, body, postId }
 * @param {Object} headers - Optional auth headers
 */
async function create(commentData, headers = {}) {
  return commentsClient.post('/', commentData, headers);
}

module.exports = {
  client: commentsClient,
  getAll,
  getByPost,
  getById,
  create,
};
