#!/usr/bin/env node

// Script to validate the OpenAPI specification
const fs = require('fs');
const yaml = require('js-yaml');

console.log('Validating OpenAPI specification...');

try {
  // Read the OpenAPI file
  const fileContents = fs.readFileSync('./openapi.yaml', 'utf8');
  
  // Parse the YAML
  const openapi = yaml.load(fileContents);
  
  // Basic validation
  if (!openapi.openapi) {
    throw new Error('Missing openapi version');
  }
  
  if (!openapi.info) {
    throw new Error('Missing info section');
  }
  
  if (!openapi.paths) {
    throw new Error('Missing paths section');
  }
  
  // Count endpoints
  let endpointCount = 0;
  for (const path in openapi.paths) {
    endpointCount += Object.keys(openapi.paths[path]).length;
  }
  
  console.log('✅ OpenAPI specification is valid');
  console.log(`✅ Version: ${openapi.openapi}`);
  console.log(`✅ Title: ${openapi.info.title}`);
  console.log(`✅ Description: ${openapi.info.description}`);
  console.log(`✅ Paths: ${Object.keys(openapi.paths).length}`);
  console.log(`✅ Endpoints: ${endpointCount}`);
  
  // Validate key components exist
  if (openapi.components && openapi.components.schemas) {
    console.log(`✅ Schemas: ${Object.keys(openapi.components.schemas).length}`);
  }
  
} catch (error) {
  console.error('❌ OpenAPI specification validation failed:');
  console.error(error.message);
  process.exit(1);
}