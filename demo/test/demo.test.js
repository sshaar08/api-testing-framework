/**
 * Demo Test - JSONPlaceholder API
 * 
 * This demonstrates how to import and use the api-test-core package
 * in your own test suite.
 */

'use strict';

const { describe, it } = require('mocha');
const { expect } = require('chai');

// Import the api-test-core package
const apiTestCore = require('api-test-core');
const { posts, users, comments, generatePostData, generateUserData } = apiTestCore;

describe('JSONPlaceholder API - Demo', () => {
  
  describe('Posts', () => {
    it('should fetch all posts', async () => {
      const response = await apiTestCore.handleRequest(posts.getAll());
      expect(response.status).to.equal(200);
      expect(response.data).to.be.an('array');
    });
    
    it('should create a new post', async () => {
      const newPost = generatePostData();
      const response = await apiTestCore.handleRequest(posts.create(newPost));
      expect(response.status).to.equal(201);
      expect(response.data.title).to.equal(newPost.title);
    });
  });
  
  describe('Users', () => {
    it('should fetch a user by ID', async () => {
      const response = await apiTestCore.handleRequest(users.getById(1));
      expect(response.status).to.equal(200);
      expect(response.data).to.have.property('name');
    });
  });
  
  describe('Comments', () => {
    it('should fetch comments for a post', async () => {
      const response = await apiTestCore.handleRequest(comments.getByPost(1));
      expect(response.status).to.equal(200);
      expect(response.data).to.be.an('array');
    });
  });
  
});
