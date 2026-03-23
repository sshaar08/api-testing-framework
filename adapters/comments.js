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
 * @param {Object} options - { params: { postId } }
 */
async function getAll(options = {}) {
  return commentsClient.get('/', options);
}

/**
 * Get comments for a post
 * getByPost :: (Number) -> Promise
 * @param {number} postId - Post ID
 */
async function getByPost(postId) {
  return commentsClient.get('/', { params: { postId } });
}

/**
 * Get single comment by ID
 * getById :: (Number) -> Promise
 * @param {number} id - Comment ID
 */
async function getById(id) {
  return commentsClient.get(`/${id}`);
}

/**
 * Create new comment
 * create :: (Object) -> Promise
 * @param {Object} commentData - { name, email, body, postId }
 */
async function create(commentData) {
  return commentsClient.post('/', commentData);
}

module.exports = {
  client: commentsClient,
  getAll,
  getByPost,
  getById,
  create,
};
