import * as core from '@actions/core'
import * as path from 'path'
import * as tc from '@actions/tool-cache'

const TOOL_NAME = 'BATS'

export async function ensureBatsAvailable(version: string): Promise<string> {
  // check cache
  let toolPath = tc.find(TOOL_NAME, version)

  if (!toolPath) {
    toolPath = await acquireBats(version)
  }
  core.debug(`BATS cached in: ${toolPath}`)

  // prepend bin directory to PATH for future tasks
  core.addPath(path.join(toolPath, 'bin'))

  return toolPath
}

async function acquireBats(version: string): Promise<string> {
  //
  // Download
  //
  const downloadPath = await tc.downloadTool(getDownloadUrl(version))

  //
  // Extract
  //
  const extPath = await tc.extractTar(downloadPath)

  //
  // Install into local cache
  //
  const toolRoot = path.join(extPath, `bats-core-${version}`)
  return await tc.cacheDir(toolRoot, TOOL_NAME, version)
}

function getDownloadUrl(version: string): string {
  return `https://github.com/bats-core/bats-core/archive/v${version}.tar.gz`
}
