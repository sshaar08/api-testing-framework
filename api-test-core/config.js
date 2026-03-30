/**
 * Configuration management for API Testing Core
 * Handles loading environment variables and providing configuration for tests
 */

'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Load environment variables from .env file
 * Searches for .env file in current directory and parent directories
 */
function loadEnvFile() {
  const envFilePath = findEnvFile(process.cwd());
  
  if (envFilePath) {
    require('dotenv').config({ path: envFilePath });
    console.log(`.env file loaded from: ${envFilePath}`);
  } else {
    console.warn('.env file not found. Using environment variables directly.');
  }
}

/**
 * Find .env file in directory tree
 * @param {string} startDir - Starting directory to search from
 * @param {number} maxLevels - Maximum directory levels to search
 * @returns {string|null} Path to .env file or null if not found
 */
function findEnvFile(startDir, maxLevels = 3) {
  let currentDir = startDir;
  
  for (let i = 0; i < maxLevels; i++) {
    const envFilePath = path.join(currentDir, '.env');
    
    if (fs.existsSync(envFilePath)) {
      return envFilePath;
    }
    
    const parentDir = path.dirname(currentDir);
    if (parentDir === startDir) {
      return null;
    }
    currentDir = parentDir;
  }
  
  return null;
}

/**
 * Get required environment variable
 * @param {string} varName - Name of environment variable
 * @returns {string} Value of environment variable
 * @throws {Error} If variable is undefined or empty
 */
function getRequiredString(varName) {
  let varValue;
  
  try {
    varValue = process.env[varName];
  } catch (e) {
    console.warn('process.env not available in non-node environment');
  }
  
  if (varValue === undefined || varValue === '' || varValue === null) {
    console.error(`Environment variable ${varName} is not defined.`);
    try {
      process.exit(1);
    } catch (e) {
      throw new Error(`Missing required environment variable: ${varName}`);
    }
  }
  
  return varValue;
}

/**
 * Get optional environment variable with default
 * @param {string} varName - Name of environment variable
 * @param {*} defaultValue - Default value if not set
 * @returns {*} Value of environment variable or default
 */
function getOptionalString(varName, defaultValue) {
  const varValue = process.env[varName];
  
  if (varValue === undefined || varValue === '' || varValue === null) {
    return defaultValue;
  }
  
  return varValue;
}

/**
 * Get boolean environment variable
 * @param {string} varName - Name of environment variable
 * @param {boolean} defaultValue - Default value if not set
 * @returns {boolean} Boolean value of environment variable
 */
function getBoolean(varName, defaultValue = false) {
  const varValue = process.env[varName];
  
  if (varValue === undefined || varValue === '' || varValue === null) {
    return defaultValue;
  }
  
  return varValue.toLowerCase() === 'true' || varValue === '1';
}

/**
 * Get integer environment variable
 * @param {string} varName - Name of environment variable
 * @param {number} defaultValue - Default value if not set
 * @returns {number} Integer value of environment variable
 */
function getInteger(varName, defaultValue) {
  const varValue = process.env[varName];
  
  if (varValue === undefined || varValue === '' || varValue === null) {
    return defaultValue;
  }
  
  const parsed = parseInt(varValue, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Validate and configure API base URL
 * @param {string} value - Base URL value
 * @returns {string} Validated base URL
 */
function validateBaseUrl(value) {
  if (!value) {
    return 'https://jsonplaceholder.typicode.com'; // Default to JSONPlaceholder
  }
  
  // Ensure URL has protocol
  if (!value.startsWith('http://') && !value.startsWith('https://')) {
    return `https://${value}`;
  }
  
  return value;
}

// Initialize environment loading
loadEnvFile();

/**
 * Main configuration object
 * Contains all settings for API testing
 */
const settings = {
  // API Configuration
  baseUrl: validateBaseUrl(getOptionalString('API_BASE_URL', 'https://jsonplaceholder.typicode.com')),
  
  // Authentication (optional)
  apiKey: getOptionalString('API_KEY', null),
  authToken: getOptionalString('AUTH_TOKEN', null),
  username: getOptionalString('API_USERNAME', null),
  password: getOptionalString('API_PASSWORD', null),
  
  // Request Configuration
  requestTimeout: getInteger('REQUEST_TIMEOUT', 30000),
  retryAttempts: getInteger('RETRY_ATTEMPTS', 3),
  retryDelay: getInteger('RETRY_DELAY', 1000),
  
  // Cache Configuration
  cacheEnabled: getBoolean('CACHE_ENABLED', true),
  cacheDir: getOptionalString('CACHE_DIR', './cache'),
  cacheExpiryDays: getInteger('CACHE_EXPIRY_DAYS', 13),
  
  // Test Configuration
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // Helper functions
  getRequiredString,
  getOptionalString,
  getBoolean,
  getInteger,
  validateBaseUrl,
};

module.exports = settings;
