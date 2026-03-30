/**
 * Comments API Integration Tests
 * 
 * Demonstrates comments API testing with api-testing-core
 */

'use strict';

const { describe, it, before } = require('mocha');
const { expect } = require('chai');
const core = require('../index.js');
const commentsAdapter = require('../adapters/comments.js');
const helper = require('../common/helper.js');

const COMMENTS_API = commentsAdapter;

describe('@comments API Integration Tests', () => {
  let createdCommentId;
  
  describe('GET /comments', () => {
    it('should fetch all comments', async () => {
      const response = await core.handleRequest(
        COMMENTS_API.getAll(),
        'Failed to fetch comments'
      );
      
      core.assertStatusCode(response, 200);
      expect(response.data).to.be.an('array');
      expect(response.data.length).to.be.greaterThan(0);
    });
    
    it('should filter comments by postId', async () => {
      const postId = 1;
      
      const response = await core.handleRequest(
        COMMENTS_API.getByPost(postId),
        'Failed to fetch comments by post'
      );
      
      core.assertStatusCode(response, 200);
      expect(response.data).to.be.an('array');
      response.data.forEach(comment => {
        expect(comment.postId).to.equal(postId);
      });
    });
  });
  
  describe('GET /comments/:id', () => {
    it('should fetch single comment by ID', async () => {
      const response = await core.handleRequest(
        COMMENTS_API.getById(1),
        'Failed to fetch comment'
      );
      
      core.assertStatusCode(response, 200);
      expect(response.data).to.have.property('id', 1);
      expect(response.data).to.have.property('name');
      expect(response.data).to.have.property('email');
      expect(response.data).to.have.property('body');
    });
  });
  
  describe('POST /comments', () => {
    it('should create a new comment', async () => {
      const commentData = helper.generateCommentData({ postId: 1 });
      
      const response = await core.handleRequest(
        COMMENTS_API.create(commentData),
        'Failed to create comment'
      );
      
      core.assertStatusCode(response, 201);
      expect(response.data).to.have.property('id');
      expect(response.data.name).to.equal(commentData.name);
      expect(response.data.email).to.equal(commentData.email);
      expect(response.data.body).to.equal(commentData.body);
      expect(response.data.postId).to.equal(commentData.postId);
      
      createdCommentId = response.data.id;
    });
  });
});
