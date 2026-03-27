/**
 * Agent API Integration Tests
 * 
 * Example of how teams use the api-test-core framework
 * to write integration tests for the Agents API
 */

'use strict';

const { expect } = require('chai');
const apiTestCore = require('..');

describe('API Test Core - Framework Verification', function() {
  
  // Verify core exports exist
  it('should export core utilities', function() {
    expect(apiTestCore.handleRequest).to.be.a('function');
    expect(apiTestCore.testWithRetries).to.be.a('function');
    expect(apiTestCore.sleep).to.be.a('function');
    expect(apiTestCore.generateEmail).to.be.a('function');
  });

  // Verify helper exports exist
  it('should export helper utilities', function() {
    expect(apiTestCore.guid).to.be.a('function');
    expect(apiTestCore.generateName).to.be.a('function');
    expect(apiTestCore.generateUserData).to.be.a('function');
    expect(apiTestCore.generatePostData).to.be.a('function');
  });

  // Verify data generation works
  it('should generate test data', function() {
    const email = apiTestCore.generateEmail('testuser');
    expect(email).to.include('@');
    
    const name = apiTestCore.generateName('full');
    expect(name).to.be.a('string');
    
    const userData = apiTestCore.generateUserData();
    expect(userData).to.have.property('id');
    expect(userData).to.have.property('email');
    expect(userData).to.have.property('firstName');
  });

  // Verify sleep works
  it('should sleep for specified duration', async function() {
    const start = Date.now();
    await apiTestCore.sleep(50);
    const elapsed = Date.now() - start;
    expect(elapsed).to.be.at.least(45);
  });

});
