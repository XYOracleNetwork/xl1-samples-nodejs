import { type ChildProcess, spawn } from 'node:child_process'

import { delay } from '@xylabs/delay'
import { HDWallet } from '@xyo-network/wallet'
import { ADDRESS_INDEX, generateXyoBaseWalletFromPhrase } from '@xyo-network/xl1-protocol-sdk'

import { helloWorld } from './helloWorld.ts'

/**
 * Starts the XL1 node using 'yarn xl1' command in a child process
 * The child process will be terminated when the parent process exits
 * @returns Promise that resolves when XL1 is ready
 */
async function startXl1(): Promise<string> {
  console.log('Starting XL1...')

  const mnemonic = process.env.XYO_WALLET_MNEMONIC ?? HDWallet.generateMnemonic()

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
    // log out the mnemonic and wallet address using same steps as producer
    const wallet = await generateXyoBaseWalletFromPhrase(mnemonic)
    const account = await wallet.derivePath(ADDRESS_INDEX.XYO)

    console.log('Generated mnemonic:', mnemonic)
    console.log('Wallet address:', account.address)

    // Spawn the XL1 process using yarn
    xl1Process = spawn('yarn', ['xl1', '--logLevel="warn"', '--producer.mnemonic', JSON.stringify(mnemonic)], {
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: true,
    })

    // Forward stdout to console
    xl1Process.stdout?.on('data', (data) => {
      const output = data.toString().trim()
      console.log(`[XL1] ${output}`)
    })

    // Forward stderr to console
    xl1Process.stderr?.on('data', (data) => {
      console.error(`[XL1] ${data.toString().trim()}`)
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

    await delay(1000)
    return mnemonic
  } catch (error) {
    console.error('Error starting XL1:', error)
    throw error
  }
}

let mnemonic: string

try {
  mnemonic = await startXl1()
} catch (ex) {
  console.error('Failed to start XL1:', ex)
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(1)
}

console.log('XL1 is ready, starting sample...')

try {
  await helloWorld(mnemonic)
} catch (error) {
  console.error('Error importing application:', error)
}
