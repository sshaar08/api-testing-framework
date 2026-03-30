/**
 * Users API Integration Tests
 * 
 * Demonstrates user-related API tests with api-testing-core
 */

'use strict';

const { describe, it, before, after } = require('mocha');
const { expect } = require('chai');
const core = require('../index.js');
const usersAdapter = require('../adapters/users.js');
const postsAdapter = require('../adapters/posts.js');

const USERS_API = usersAdapter;
const POSTS_API = postsAdapter;

describe('@users API Integration Tests', () => {
  describe('GET /users', () => {
    it('should fetch all users', async () => {
      const response = await core.handleRequest(
        USERS_API.getAll(),
        'Failed to fetch users'
      );
      
      core.assertStatusCode(response, 200);
      expect(response.data).to.be.an('array');
      expect(response.data.length).to.be.greaterThan(0);
    });
    
    it('should have valid user data structure', async () => {
      const response = await core.handleRequest(
        USERS_API.getAll(),
        'Failed to fetch users'
      );
      
      const user = response.data[0];
      expect(user).to.have.property('id');
      expect(user).to.have.property('name');
      expect(user).to.have.property('username');
      expect(user).to.have.property('email');
      expect(user).to.have.property('address');
      expect(user).to.have.property('phone');
    });
  });
  
  describe('GET /users/:id', () => {
    it('should fetch single user by ID', async () => {
      const response = await core.handleRequest(
        USERS_API.getById(1),
        'Failed to fetch user'
      );
      
      core.assertStatusCode(response, 200);
      expect(response.data).to.have.property('id', 1);
      expect(response.data).to.have.property('email');
    });
    
    it('should return 404 for non-existent user', async () => {
      let errorCaught = false;
      try {
        await core.handleRequest(
          USERS_API.getById(999999),
          'Failed to fetch user'
        );
      } catch (e) {
        errorCaught = true;
        expect(e.message).to.include('404');
      }
      expect(errorCaught).to.be.true;
    });
  });
  
  describe('User Posts Integration', () => {
    it('should fetch posts for a specific user', async () => {
      const userId = 1;
      
      const response = await core.handleRequest(
        POSTS_API.getByUser(userId),
        'Failed to fetch user posts'
      );
      
      core.assertStatusCode(response, 200);
      expect(response.data).to.be.an('array');
      response.data.forEach(post => {
        expect(post.userId).to.equal(userId);
      });
    });
  });
});
