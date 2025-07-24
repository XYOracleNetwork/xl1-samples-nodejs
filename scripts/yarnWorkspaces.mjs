import { spawnSync } from 'node:child_process'

export const yarnWorkspaces = () => {
  const result = spawnSync('yarn', ['workspaces', 'list', '--json', '--recursive'], { encoding: 'utf8', shell: true })
  if (result.error) {
    throw result.error
  }
  return (
    result.stdout
      .toString()
      // NOTE: This probably doesn't work on Windows
      // TODO: Replace /r/n with /n first
      .split('\n')
      .slice(0, -1)
      .map((item) => {
        return JSON.parse(item)
      })
  )
}
