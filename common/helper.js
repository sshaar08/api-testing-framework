/**
 * Utility Helper Functions for API Testing
 * Common functionality used across API tests
 * 
 * Contains:
 * - UUID generation
 * - Random data generation
 * - Payload factories
 * - Data transformation utilities
 */

'use strict';

const R = require('ramda');
const { v4: uuidv4 } = require('uuid');

/**
 * Generate a unique identifier (UUID v4)
 * @returns {string} UUID string
 */
function guid() {
  return uuidv4().replace(/-/g, '');
}

/**
 * Generate a unique identifier with specified length
 * @param {number} length - Desired length of the identifier
 * @returns {string} Unique identifier string
 */
function generateId(length = 15) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate a random email address
 * @param {string} prefix - Email prefix (default: 'test')
 * @param {string} domain - Email domain (default: 'test.com')
 * @returns {string} Generated email address
 */
function generateEmail(prefix = 'test', domain = 'test.com') {
  return `${prefix}_${guid(10)}@${domain}`;
}

/**
 * Generate a random phone number
 * @param {string} format - Format pattern (default: US format)
 * @returns {string} Random phone number
 */
function generatePhoneNumber(format = 'US') {
  if (format === 'US') {
    const areaCode = Math.floor(Math.random() * 900) + 100;
    const prefix = Math.floor(Math.random() * 900) + 100;
    const lineNum = Math.floor(Math.random() * 9000) + 1000;
    return `+1${areaCode}${prefix}${lineNum}`;
  }
  return `+1555${guid(7)}`;
}

/**
 * Generate a random name
 * @param {string} type - Type of name: 'first', 'last', or 'full'
 * @returns {string} Random name
 */
function generateName(type = 'full') {
  const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 
                      'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Susan',
                      'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia',
                    'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez',
                    'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore'];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  if (type === 'first') return firstName;
  if (type === 'last') return lastName;
  return `${firstName} ${lastName}`;
}

/**
 * Get an array of N unique random elements from an array
 * @param {Array} array - Source array
 * @param {number} count - Number of elements to pick
 * @returns {Array} Array of randomly picked elements
 */
function getUniqueRandomElements(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/**
 * Create a random string of specified length
 * @param {number} length - Length of the string
 * @returns {string} Random string
 */
function randomString(length = 10) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate a random integer between min and max
 * @param {number} min - Minimum value (inclusive)
 * @param {number} max - Maximum value (inclusive)
 * @returns {number} Random integer
 */
function randomInt(min = 0, max = 100) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a random boolean
 * @returns {boolean} Random boolean
 */
function randomBoolean() {
  return Math.random() >= 0.5;
}

/**
 * Generate a random date within a range
 * @param {Date} start - Start date
 * @param {Date} end - End date
 * @returns {Date} Random date
 */
function randomDate(start = new Date(2020, 0, 1), end = new Date()) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

/**
 * Generate test user data object
 * @param {Object} overrides - Override default values
 * @returns {Object} User data object
 */
function generateUserData(overrides = {}) {
  const defaults = {
    id: guid(),
    email: generateEmail(),
    firstName: generateName('first'),
    lastName: generateName('last'),
    phone: generatePhoneNumber(),
    username: generateId(8),
    createdAt: new Date().toISOString(),
    active: true,
  };
  
  return { ...defaults, ...overrides };
}

/**
 * Generate test post data object
 * @param {Object} overrides - Override default values
 * @returns {Object} Post data object
 */
function generatePostData(overrides = {}) {
  const defaults = {
    title: `Test Post ${guid(6)}`,
    body: `This is a test post body with some content. ID: ${guid()}`,
    userId: randomInt(1, 10),
  };
  
  return { ...defaults, ...overrides };
}

/**
 * Generate test comment data object
 * @param {Object} overrides - Override default values
 * @returns {Object} Comment data object
 */
function generateCommentData(overrides = {}) {
  const defaults = {
    name: generateName('full'),
    email: generateEmail(),
    body: `Test comment body. ID: ${guid()}`,
    postId: randomInt(1, 100),
  };
  
  return { ...defaults, ...overrides };
}

/**
 * Generate multiple items of test data
 * @param {Function} generatorFn - Function to generate single item
 * @param {number} count - Number of items to generate
 * @returns {Array} Array of generated items
 */
function generateMultiple(generatorFn, count = 5) {
  return Array.from({ length: count }, () => generatorFn());
}

/**
 * Wait for specified milliseconds
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} Promise that resolves after delay
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Sanitize object by removing null/undefined values
 * @param {Object} obj - Object to sanitize
 * @returns {Object} Sanitized object
 */
function sanitize(obj) {
  return R.reject(R.isNil, obj);
}

/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
function deepClone(obj) {
  return R.clone(obj);
}

/**
 * Merge multiple objects deeply
 * @param {...Object} objects - Objects to merge
 * @returns {Object} Merged object
 */
function deepMerge(...objects) {
  return R.mergeAll(objects);
}

/**
 * Pick specific keys from object
 * @param {Array} keys - Keys to pick
 * @param {Object} obj - Source object
 * @returns {Object} Object with only picked keys
 */
function pickKeys(keys, obj) {
  return R.pick(keys, obj);
}

/**
 * Omit specific keys from object
 * @param {Array} keys - Keys to omit
 * @param {Object} obj - Source object
 * @returns {Object} Object without omitted keys
 */
function omitKeys(keys, obj) {
  return R.omit(keys, obj);
}

/**
 * Convert object to query string
 * @param {Object} obj - Object to convert
 * @returns {string} Query string
 */
function toQueryString(obj) {
  return new URLSearchParams(obj).toString();
}

// Export all helper functions
module.exports = {
  // Generation functions
  guid,
  generateId,
  generateEmail,
  generatePhoneNumber,
  generateName,
  generateUserData,
  generatePostData,
  generateCommentData,
  generateMultiple,
  
  // Random utilities
  getUniqueRandomElements,
  randomString,
  randomInt,
  randomBoolean,
  randomDate,
  
  // Common utilities
  sleep,
  sanitize,
  deepClone,
  deepMerge,
  pickKeys,
  omitKeys,
  toQueryString,
};
