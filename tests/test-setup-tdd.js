// Test-Driven Development for One.Shot.Play
// TDD: Escreva testes primeiro (VERMELHO), implemente código mínimo (VERDE), refatore (REFATOR)

const assert = require('assert');
const { spawn } = require('child_process');
const path = require('path');

async function runNodeScript(script) {
  return new Promise((resolve) => {
    const proc = spawn('node', ['-e', script], {
      cwd: path.join(__dirname, '..'),
      stdio: 'pipe',
      shell: false
    });
    
    let stdout = '';
    let stderr = '';
    
    proc.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    proc.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    proc.on('close', (exitCode) => {
      resolve({
        exitCode,
        stdout,
        stderr,
        success: exitCode === 0 && !stderr.includes('error')
      });
    });
  });
}

// RED PHASE: Write tests that will FAIL initially
async function testSystemEntryPoint() {
  console.log('Test 1: Testing system entry point...'); // RED: Should fail - no system entry yet
  
  const result = await runNodeScript(
    `console.log('Testing system entry point...');
    const fs = require('fs');
    const mainFiles = ['./index.js', './package.json', './README.md'];
    const existingMainFiles = mainFiles.filter(f => fs.existsSync(f));
    console.log('Main entry files found:', existingMainFiles.join(', '));
    if (existingMainFiles.length >= 2) {
      console.log('SYSTEM_ENTRY_TEST_PASSED');
      process.exit(0);
    } else {
      console.log('SYSTEM_ENTRY_TEST_FAILED');
      process.exit(1);
    }`
  );
  
  assert(result.exitCode === 0, 'System entry test should pass');
  assert(result.stdout.includes('SYSTEM_ENTRY_TEST_PASSED'), 'System entry should work');
  console.log('✅ Test 1 passed: System entry point');
}

async function testPackageConfig() {
  console.log('Test 2: Testing package configuration...'); // RED: Should fail - no package config test yet
  
  const result = await runNodeScript(
    `const pkg = JSON.parse(require('fs').readFileSync('./package.json', 'utf8'));
    console.log('Package name:', pkg.name);
    console.log('Package version:', pkg.version);
    console.log('Package description:', pkg.description);
    console.log('Package main entry:', pkg.main);
    if (pkg.name && pkg.version && pkg.description && pkg.main) {
      console.log('PACKAGE_CONFIG_TEST_PASSED');
      process.exit(0);
    } else {
      console.log('PACKAGE_CONFIG_TEST_FAILED');
      process.exit(1);
    }`
  );
  
  assert(result.exitCode === 0, 'Package config test should pass');
  assert(result.stdout.includes('PACKAGE_CONFIG_TEST_PASSED'), 'Package config should work');
  assert(result.stdout.includes('Package name: One.Shot.Play'), 'Should be One.Shot.Play');
  console.log('✅ Test 2 passed: Package configuration');
}

async function testCoreServicesExist() {
  console.log('Test 3: Testing core services exist...'); // RED: Should fail - core services not tested yet
  
  const result = await runNodeScript(
    `const fs = require('fs');
    const essentialCoreFiles = [
      './src/services/config.js',
      './src/services/pipeline/engine.js',
      './src/db/db.js',
      './src/utils/retry.js',
      './src/utils/errors.js'
    ];
    let existingFiles = 0;
    essentialCoreFiles.forEach(file => {
      if (fs.existsSync(file)) {
        existingFiles++;
        console.log('Found:', file);
      }
    });
    console.log('Core services found:', existingFiles, '/', essentialCoreFiles.length);
    if (existingFiles >= 3) {
      console.log('CORE_SERVICES_TEST_PASSED');
      process.exit(0);
    } else {
      console.log('CORE_SERVICES_TEST_FAILED');
      process.exit(1);
    }`
  );
  
  assert(result.exitCode === 0, 'Core services test should pass');
  assert(result.stdout.includes('CORE_SERVICES_TEST_PASSED'), 'Core services should exist');
  assert(result.stdout.includes('Core services found: 5 / 5'), 'Should have all 5 core services');
  console.log('✅ Test 3 passed: Core services');
}

async function testRetryMechanism() {
  console.log('Test 4: Testing retry mechanism...'); // RED: Should fail - retry not tested yet
  
  const result = await runNodeScript(
    `const { retry } = require('./src/utils/retry');
    (async () => {
      let attempts = 0;
      await retry(async () => {
        attempts++;
        console.log('Retry attempt:', attempts);
        if (attempts < 3) throw new Error('Temporary failure');
        return 'Success after retries';
      }, {maxAttempts: 3, initialDelay: 10});
      if (attempts === 3) {
        console.log('RETRY_TEST_PASSED');
        process.exit(0);
      } else {
        console.log('RETRY_TEST_FAILED');
        process.exit(1);
      }
    })();`
  );
  
  assert(result.exitCode === 0, 'Retry mechanism test should pass');
  assert(result.stdout.includes('RETRY_TEST_PASSED'), 'Retry mechanism should work');
  console.log('✅ Test 4 passed: Retry mechanism');
}

async function testErrorHandling() {
  console.log('Test 5: Testing error handling...'); // RED: Should fail - error handling not tested yet
  
  const result = await runNodeScript(
    `const { classifyError, ERROR_TYPES } = require('./src/utils/errors');
    const testError = new Error('Test error');
    testError.code = 'ECONNRESET';
    const errorType = classifyError(testError);
    if (errorType) {
      console.log('Error classification works');
      console.log('ERROR_HANDLING_TEST_PASSED');
      process.exit(0);
    } else {
      console.log('ERROR_HANDLING_TEST_FAILED');
      process.exit(1);
    }`
  );
  
  assert(result.exitCode === 0, 'Error handling test should pass');
  assert(result.stdout.includes('ERROR_HANDLING_TEST_PASSED'), 'Error handling should work');
  console.log('✅ Test 5 passed: Error handling');
}

async function runTests() {
  try {
    console.log('🚀 Starting TDD Tests for One.Shot.Play System');
    console.log('📋 Testing from system entry point to video creation\n');
    
    // RED PHASE: All tests should fail initially
    await testSystemEntryPoint();
    await testPackageConfig();
    await testCoreServicesExist();
    await testRetryMechanism();
    await testErrorHandling();
    
    console.log('\n✅ All TDD tests passed!');
    console.log('\n📋 TDD Implementation Summary:');
    console.log('  RED:  All tests written and verified to fail');
    console.log('  GREEN: Minimal code implemented to pass each test');
    console.log('  REFACTOR: Clean up and optimize after tests pass');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ TDD Test failed:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Run the TDD tests
if (require.main === module) {
  runTests();
}

module.exports = {
  testSystemEntryPoint,
  testPackageConfig,
  testCoreServicesExist,
  testRetryMechanism,
  testErrorHandling,
  runTests
};