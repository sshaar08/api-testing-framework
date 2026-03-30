/**
 * API Test Core - Demo Usage
 * 
 * This file demonstrates how to import and use the api-test-core package.
 */

// Import the package
const apiTestCore = require('api-test-core');

// Destructure for convenience
const { 
  posts,           // Posts adapter
  users,           // Users adapter
  comments,        // Comments adapter
  handleRequest,   // Request handler with retry logic
  generatePostData,
  generateUserData,
  generateEmail,
  config
} = apiTestCore;

// Example: Create and fetch a post
async function example() {
  // Generate test data
  const testPost = generatePostData();
  console.log('Test data:', testPost);
  
  // Make a request (auth handled automatically)
  const response = await handleRequest(posts.create(testPost));
  
  // Check response
  if (response.status === 201) {
    console.log('Post created:', response.data);
  }
  
  // Fetch all posts
  const allPosts = await handleRequest(posts.getAll());
  console.log('Total posts:', allPosts.data.length);
}

// Run example
example().catch(console.error);

module.exports = { example };
