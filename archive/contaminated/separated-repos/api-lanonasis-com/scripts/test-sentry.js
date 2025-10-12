#!/usr/bin/env node
/**
 * Sentry Configuration Test Script
 * Tests if Sentry credentials are valid without deployment
 */

const https = require('https');

// Configuration (these would come from environment variables)
const SENTRY_ORG = process.env.SENTRY_ORG || 'your-org';
const SENTRY_PROJECT = process.env.SENTRY_PROJECT || 'your-project';
const SENTRY_AUTH_TOKEN = process.env.SENTRY_AUTH_TOKEN;

if (!SENTRY_AUTH_TOKEN) {
  console.error('❌ SENTRY_AUTH_TOKEN environment variable is not set');
  console.log('\nTo test Sentry configuration, run:');
  console.log('SENTRY_AUTH_TOKEN=your-token SENTRY_ORG=your-org SENTRY_PROJECT=your-project node test-sentry.js\n');
  process.exit(1);
}

console.log('🔍 Testing Sentry Configuration...\n');
console.log(`Organization: ${SENTRY_ORG}`);
console.log(`Project: ${SENTRY_PROJECT}`);
console.log(`Auth Token: ${SENTRY_AUTH_TOKEN.substring(0, 10)}...`);
console.log('\n-------------------\n');

// Test 1: Verify auth token is valid
function testAuthToken() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'sentry.io',
      path: '/api/0/',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SENTRY_AUTH_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    console.log('1️⃣ Testing authentication...');
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Authentication successful!\n');
          resolve(true);
        } else {
          console.log(`❌ Authentication failed: ${res.statusCode}`);
          console.log(`Response: ${data}\n`);
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Connection error:', error.message);
      reject(error);
    });

    req.end();
  });
}

// Test 2: Check if organization exists
function testOrganization() {
  return new Promise((resolve) => {
    const options = {
      hostname: 'sentry.io',
      path: `/api/0/organizations/${SENTRY_ORG}/`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SENTRY_AUTH_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    console.log('2️⃣ Checking organization...');
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          const org = JSON.parse(data);
          console.log(`✅ Organization found: ${org.name} (${org.slug})\n`);
          resolve(true);
        } else {
          console.log(`❌ Organization not found: ${res.statusCode}`);
          console.log(`Make sure '${SENTRY_ORG}' is correct\n`);
          resolve(false);
        }
      });
    });

    req.on('error', () => resolve(false));
    req.end();
  });
}

// Test 3: Check if project exists
function testProject() {
  return new Promise((resolve) => {
    const options = {
      hostname: 'sentry.io',
      path: `/api/0/projects/${SENTRY_ORG}/${SENTRY_PROJECT}/`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SENTRY_AUTH_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    console.log('3️⃣ Checking project...');
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          const project = JSON.parse(data);
          console.log(`✅ Project found: ${project.name} (${project.slug})`);
          console.log(`   Platform: ${project.platform || 'not set'}`);
          console.log(`   Status: ${project.status}\n`);
          resolve(true);
        } else {
          console.log(`❌ Project not found: ${res.statusCode}`);
          console.log(`Make sure '${SENTRY_PROJECT}' exists in '${SENTRY_ORG}'\n`);
          resolve(false);
        }
      });
    });

    req.on('error', () => resolve(false));
    req.end();
  });
}

// Run all tests
async function runTests() {
  try {
    const authOk = await testAuthToken();
    if (!authOk) {
      console.log('⚠️  Fix authentication before proceeding\n');
      return;
    }

    const orgOk = await testOrganization();
    const projectOk = await testProject();

    console.log('-------------------\n');
    console.log('📊 Summary:');
    console.log(`Authentication: ${authOk ? '✅' : '❌'}`);
    console.log(`Organization: ${orgOk ? '✅' : '❌'}`);
    console.log(`Project: ${projectOk ? '✅' : '❌'}`);

    if (authOk && orgOk && projectOk) {
      console.log('\n✨ All tests passed! Sentry is properly configured.');
      console.log('\nYou can add these to Netlify environment variables:');
      console.log(`SENTRY_ORG=${SENTRY_ORG}`);
      console.log(`SENTRY_PROJECT=${SENTRY_PROJECT}`);
      console.log(`SENTRY_AUTH_TOKEN=<your-token>`);
      process.exit(0);
    } else {
      console.log('\n❌ Some tests failed. Check the configuration above.');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

runTests();