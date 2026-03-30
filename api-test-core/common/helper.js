/**
 * Utility Helper Functions for API Testing
 * 
 * Uses @faker-js/faker for realistic test data generation.
 */

'use strict';

const { faker } = require('@faker-js/faker');

/**
 * Generate a unique identifier (UUID v4)
 * @returns {string} UUID string
 */
function guid() {
  return faker.string.uuid();
}

/**
 * Generate a unique identifier with specified length
 * @param {number} length - Desired length
 * @returns {string} Identifier string
 */
function generateId(length = 15) {
  return faker.string.alphanumeric(length);
}

/**
 * Generate a random email address
 * @param {string} prefix - Email prefix
 * @param {string} domain - Email domain
 * @returns {string} Generated email
 */
function generateEmail(prefix = 'test', domain = 'test.com') {
  return faker.internet.email({ firstName: prefix });
}

/**
 * Generate a random phone number
 * @returns {string} Random phone number
 */
function generatePhoneNumber() {
  return faker.phone.number();
}

/**
 * Generate a random name
 * @param {string} type - 'first', 'last', or 'full'
 * @returns {string} Random name
 */
function generateName(type = 'full') {
  if (type === 'first') return faker.person.firstName();
  if (type === 'last') return faker.person.lastName();
  return faker.person.fullName();
}

/**
 * Generate a random integer between min and max
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random integer
 */
function randomInt(min = 0, max = 100) {
  return faker.number.int({ min, max });
}

/**
 * Generate test user data object
 * @param {Object} overrides - Override defaults
 * @returns {Object} User data
 */
function generateUserData(overrides = {}) {
  const defaults = {
    id: guid(),
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    phone: faker.phone.number(),
    username: faker.internet.username(),
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
    title: faker.lorem.sentence(),
    body: faker.lorem.paragraph(),
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
    name: faker.person.fullName(),
    email: faker.internet.email(),
    body: faker.lorem.sentence(),
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
