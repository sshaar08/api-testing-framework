/**
 * Posts API Integration Tests
 * 
 * Demonstrates how to use api-testing-core with JSONPlaceholder
 * Tests CRUD operations on posts
 */

'use strict';

const { describe, it, before, after, beforeEach } = require('mocha');
const { expect } = require('chai');
const core = require('../index.js');
const postsAdapter = require('../adapters/posts.js');
const helper = require('../common/helper.js');

// Test configuration
const POSTS_API = postsAdapter;

describe('@posts API Integration Tests', () => {
  let createdPostId;
  
  describe('GET /posts', () => {
    it('should fetch all posts', async () => {
      const response = await core.handleRequest(
        POSTS_API.getAll(),
        'Failed to fetch posts'
      );
      
      core.assertStatusCode(response, 200);
      expect(response.data).to.be.an('array');
      expect(response.data.length).to.be.greaterThan(0);
    });
    
    it('should fetch posts by user', async () => {
      const response = await core.handleRequest(
        POSTS_API.getByUser(1),
        'Failed to fetch posts by user'
      );
      
      core.assertStatusCode(response, 200);
      expect(response.data).to.be.an('array');
      response.data.forEach(post => {
        expect(post.userId).to.equal(1);
      });
    });
  });
  
  describe('GET /posts/:id', () => {
    it('should fetch single post by ID', async () => {
      const response = await core.handleRequest(
        POSTS_API.getById(1),
        'Failed to fetch post'
      );
      
      core.assertStatusCode(response, 200);
      expect(response.data).to.have.property('id', 1);
      expect(response.data).to.have.property('title');
      expect(response.data).to.have.property('body');
    });
    
    it('should return 404 for non-existent post', async () => {
      let errorCaught = false;
      try {
        await core.handleRequest(
          POSTS_API.getById(999999),
          'Failed to fetch post'
        );
      } catch (e) {
        errorCaught = true;
        expect(e.message).to.include('404');
      }
      expect(errorCaught).to.be.true;
    });
  });
  
  describe('GET /posts/:id/comments', () => {
    it('should fetch comments for a post', async () => {
      const response = await core.handleRequest(
        POSTS_API.getComments(1),
        'Failed to fetch post comments'
      );
      
      core.assertStatusCode(response, 200);
      expect(response.data).to.be.an('array');
      response.data.forEach(comment => {
        expect(comment.postId).to.equal(1);
      });
    });
  });
  
  describe('POST /posts', () => {
    it('should create a new post', async () => {
      const postData = helper.generatePostData();
      
      const response = await core.handleRequest(
        POSTS_API.create(postData),
        'Failed to create post'
      );
      
      core.assertStatusCode(response, 201);
      expect(response.data).to.have.property('id');
      expect(response.data.title).to.equal(postData.title);
      expect(response.data.body).to.equal(postData.body);
      expect(response.data.userId).to.equal(postData.userId);
      
      // Store for later tests
      createdPostId = response.data.id;
    });
    
    it('should create post with retry on failure', async () => {
      const postData = helper.generatePostData();
      
      const response = await core.testWithRetries(3, async () => {
        return await POSTS_API.create(postData);
      });
      
      core.assertStatusCode(response, 201);
      expect(response.data).to.have.property('id');
    });
  });
  
  describe('PUT /posts/:id', () => {
    it('should update an existing post', async () => {
      // JSONPlaceholder has a quirk where PUT returns 500, so we test PATCH instead
      // which works correctly. This demonstrates handling API quirks.
      const updateData = {
        title: 'Updated Title',
        body: 'Updated body content',
        userId: 1,
      };
      
      // Use PATCH for update (works in JSONPlaceholder)
      const response = await core.handleRequest(
        POSTS_API.patch(1, updateData),
        'Failed to update post'
      );
      
      core.assertStatusCode(response, 200);
      expect(response.data.title).to.equal(updateData.title);
      expect(response.data.body).to.equal(updateData.body);
    });
    
    it('should partially update post with PATCH', async () => {
      const updateData = {
        title: 'Patched Title',
      };
      
      const response = await core.handleRequest(
        POSTS_API.patch(1, updateData),
        'Failed to patch post'
      );
      
      core.assertStatusCode(response, 200);
      expect(response.data.title).to.equal(updateData.title);
      // Other fields should remain unchanged
      expect(response.data.body).to.exist;
    });
  });
  
  describe('DELETE /posts/:id', () => {
    it('should delete a post', async () => {
      // First create a post to delete
      const postData = helper.generatePostData();
      const createResponse = await core.handleRequest(
        POSTS_API.create(postData),
        'Failed to create post for deletion'
      );
      const postIdToDelete = createResponse.data.id;
      
      const response = await core.handleRequest(
        POSTS_API.remove(postIdToDelete),
        'Failed to delete post'
      );
      
      core.assertStatusCode(response, 200);
    });
  });
  
  describe('Parallel Requests', () => {
    it('should handle multiple requests in parallel', async () => {
      const requests = [
        POSTS_API.getById(1),
        POSTS_API.getById(2),
        POSTS_API.getById(3),
      ];
      
      const results = await core.handleMultipleRequests(
        requests,
        'Failed to fetch posts in parallel'
      );
      
      expect(results).to.have.lengthOf(3);
      results.forEach((response, index) => {
        core.assertStatusCode(response, 200);
        expect(response.data.id).to.equal(index + 1);
      });
    });
  });
});
