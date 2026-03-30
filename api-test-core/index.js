/**
 * API Testing Core - Main Entry Point
 * 
 * Export all core functionality for easy access
 */

'use strict';

// Core testing functionality
const core = require('./common/core.js');
const helper = require('./common/helper.js');
const auth = require('./common/authentication.js');
const config = require('./config.js');

// Adapters
const postsAdapter = require('./adapters/posts.js');
const usersAdapter = require('./adapters/users.js');
const commentsAdapter = require('./adapters/comments.js');

module.exports = {
  // Core
  ...core,
  
  // Helper utilities
  ...helper,
  
  // Authentication
  ...auth,
  
  // Configuration
  config,
  
  // Adapters
  posts: postsAdapter,
  users: usersAdapter,
  comments: commentsAdapter,
};
