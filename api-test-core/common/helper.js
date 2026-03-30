/**
 * Utility Helper Functions for API Testing
 * 
 * Contains only the helpers actually used in tests.
 */

'use strict';

const { v4: uuidv4 } = require('uuid');

/**
 * Generate a unique identifier (UUID v4, stripped)
 * @returns {string} UUID string
 */
function guid() {
  return uuidv4().replace(/-/g, '');
}

/**
 * Generate a unique identifier with specified length
 * @param {number} length - Desired length
 * @returns {string} Identifier string
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
 * @param {string} prefix - Email prefix
 * @param {string} domain - Email domain
 * @returns {string} Generated email
 */
function generateEmail(prefix = 'test', domain = 'test.com') {
  return `${prefix}_${guid(10)}@${domain}`;
}

/**
 * Generate a random phone number
 * @returns {string} Random phone number
 */
function generatePhoneNumber() {
  const areaCode = Math.floor(Math.random() * 900) + 100;
  const prefix = Math.floor(Math.random() * 900) + 100;
  const lineNum = Math.floor(Math.random() * 9000) + 1000;
  return `+1${areaCode}${prefix}${lineNum}`;
}

/**
 * Generate a random name
 * @param {string} type - 'first', 'last', or 'full'
 * @returns {string} Random name
 */
function generateName(type = 'full') {
  const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 
                      'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Susan',
                      'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia',
                    'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez'];

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

  if (type === 'first') return firstName;
  if (type === 'last') return lastName;
  return `${firstName} ${lastName}`;
}

/**
 * Generate a random integer between min and max
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random integer
 */
function randomInt(min = 0, max = 100) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate test user data object
 * @param {Object} overrides - Override defaults
 * @returns {Object} User data
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
 * @param {Object} overrides - Override defaults
 * @returns {Object} Post data
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
 * @param {Object} overrides - Override defaults
 * @returns {Object} Comment data
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

module.exports = {
  guid,
  generateId,
  generateEmail,
  generatePhoneNumber,
  generateName,
  randomInt,
  generateUserData,
  generatePostData,
  generateCommentData,
};
