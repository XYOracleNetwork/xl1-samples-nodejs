import { type ChildProcess, spawn } from 'node:child_process'

import type { XyoViewer } from '@xyo-network/xl1-sdk'
import { XyoViewerMoniker } from '@xyo-network/xl1-sdk'

import { getLocator } from './getLocator.ts'
import { getSignerAccount } from './getSignerAccount.ts'
import { getWalletMnemonic } from './getWalletMnemonic.ts'
import { helloWorld } from './helloWorld.js'
import { waitForInitialBlocks } from './waitForInitialBlocks.js'

// Parse the relevant ENV VARs or use defaults
const mnemonic = getWalletMnemonic()

/**
 * Starts the XL1 node using command in a child process
 * The child process will be terminated when the parent process exits
 * @returns Promise that resolves when XL1 is ready
 */
async function startXl1(): Promise<string> {
  console.log('Starting XL1...')

  // Track the child process
  let xl1Process: ChildProcess | null = null

  // Setup cleanup handlers for various termination signals
  const cleanup = () => {
    if (xl1Process) {
      console.log('Shutting down XL1 process...')
      xl1Process.kill()
      xl1Process = null
    }
  }

  // Register cleanup handlers
  process.on('exit', cleanup)
  process.on('SIGINT', () => {
    cleanup()
    process.exit(0)
  })
  process.on('SIGTERM', () => {
    cleanup()
    process.exit(0)
  })
  process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error)
    cleanup()
    process.exit(1)
  })

  try {
    // Log out the mnemonic and signer address in case random was generated
    const account = await getSignerAccount()
    console.log('Using signer mnemonic:', mnemonic)
    console.log('Using producer address:', account.address)

    // Spawn the XL1 process
    xl1Process = spawn(
      'node',
      [
        './node_modules/@xyo-network/xl1-cli/scripts/xl1.mjs',
        'start',
        'api',
        'producer',
        'validator',
        '--logLevel="warn"',
      ],
      {
        stdio: ['ignore', 'pipe', 'pipe'],
        shell: true,
      },
    )

    // Forward stdout to console
    xl1Process.stdout?.on('data', (data) => {
      const output = data.toString().trim()
      console.log(`[XL1][stdout] ${output}`)
    })

    // Forward stderr to console
    xl1Process.stderr?.on('data', (data) => {
      console.error(`[XL1][stderr]${data.toString().trim()}`)
    })

    // Handle process exit
    xl1Process.on('close', (code) => {
      if (code !== 0 && xl1Process !== null) {
        console.error(`XL1 process exited with code ${code}`)
        throw new Error(`XL1 process exited with code ${code}`)
      }
    })

    // Handle process errors
    xl1Process.on('error', (error) => {
      console.error('Failed to start XL1:', error)
      throw error
    })

    // Get the XyoViewer instance
    const locator = await getLocator()
    const viewer = await locator.getInstance<XyoViewer>(XyoViewerMoniker)

    // Wait for the initial blocks to be created
    await waitForInitialBlocks(viewer)

    return mnemonic
  } catch (error) {
    console.error('Error starting XL1:', error)
    throw error
  }
}

try {
  await startXl1()
} catch (ex) {
  console.error('Failed to start XL1:', ex)
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(1)
}

console.log('XL1 is ready, starting sample...')

try {
  await helloWorld()
} catch (error) {
  console.error('Error importing application:', error)
}
