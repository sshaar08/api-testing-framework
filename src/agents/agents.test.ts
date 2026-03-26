/**
 * Agent API Integration Tests
 * 
 * Example of how teams used the @company/api-helpers package
 * to write integration tests without knowing Java or auth setup
 */

import { describe, it, expect, beforeEach } from 'chai';
import { agents } from '@company/api-helpers';

describe('Agents API', () => {
  
  // Test: Create a new agent
  it('should create an agent and return 201', async () => {
    const response = await agents.create({
      name: 'Test Agent',
      type: 'standard',
      metadata: {
        source: 'integration-test'
      }
    });
    
    expect(response.status).to.equal(201);
    expect(response.body).to.have.property('id');
    expect(response.body.name).to.equal('Test Agent');
  });

  // Test: Handle duplicate agents
  it('should handle duplicate agent names gracefully', async () => {
    const agentName = `duplicate-test-${Date.now()}`;
    
    // Create first agent
    await agents.create({ name: agentName });
    
    // Try to create duplicate - should handle gracefully
    const response = await agents.create({ name: agentName });
    
    // Either returns 409 Conflict or succeeds with warning
    expect([200, 201, 409]).to.include(response.status);
  });

  // Test: Get agent by ID
  it('should retrieve an agent by ID', async () => {
    // First create an agent
    const createResponse = await agents.create({ name: 'Get Test Agent' });
    const agentId = createResponse.body.id;
    
    // Then retrieve it
    const getResponse = await agents.get(agentId);
    
    expect(getResponse.status).to.equal(200);
    expect(getResponse.body.id).to.equal(agentId);
  });

  // Test: Update agent
  it('should update an existing agent', async () => {
    // Create agent
    const createResponse = await agents.create({ name: 'Update Test Agent' });
    const agentId = createResponse.body.id;
    
    // Update it
    const updateResponse = await agents.update(agentId, {
      name: 'Updated Agent Name',
      status: 'active'
    });
    
    expect(updateResponse.status).to.equal(200);
    expect(updateResponse.body.name).to.equal('Updated Agent Name');
  });

  // Test: Delete agent
  it('should delete an agent', async () => {
    // Create agent
    const createResponse = await agents.create({ name: 'Delete Test Agent' });
    const agentId = createResponse.body.id;
    
    // Delete it
    const deleteResponse = await agents.delete(agentId);
    
    expect(deleteResponse.status).to.equal(204);
    
    // Verify it's gone
    const getResponse = await agents.get(agentId);
    expect(getResponse.status).to.equal(404);
  });

});
