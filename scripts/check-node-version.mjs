#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import semver from 'semver'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Step 1: Read package.json
const packageJsonPath = path.resolve(__dirname, '../package.json')

let packageJson
try {
  const raw = fs.readFileSync(packageJsonPath, 'utf-8')
  packageJson = JSON.parse(raw)
} catch (err) {
  console.error('❌ Failed to read package.json:', err.message)
  process.exit(1)
}

// Step 2: Extract engines.node
const requiredNode = packageJson.engines?.node

if (!requiredNode) {
  console.warn('⚠️ No "engines.node" field found in package.json.')
  process.exit(0) // No check needed
}

// Step 3: Check current version
const currentVersion = process.versions.node

if (semver.satisfies(currentVersion, requiredNode)) {
  console.log(`✅ Node.js ${currentVersion} satisfies "${requiredNode}".`)
  process.exit(0)
} else {
  console.error(`❌ Node.js ${currentVersion} does NOT satisfy "engines.node": "${requiredNode}".`)
  process.exit(1)
}