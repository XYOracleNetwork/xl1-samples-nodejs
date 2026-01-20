import { getMnemonic } from './getMnemonic.ts'
import { getRpcUrl } from './getRpcUrl.ts'
import { helloWorld } from './helloWorld.js'

// Parse the relevant ENV VARs or use defaults
const mnemonic = getMnemonic()
const rpcUrl = getRpcUrl()

await helloWorld(mnemonic, rpcUrl)
