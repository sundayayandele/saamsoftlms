import execa from 'execa'
import { resolve } from 'path'
import { NPM_REGISTRY } from '../init.mjs'
import { getPackageInfo } from '../pkg-mng/lib/pkg.mjs'
import { IS_DEVELOPMENT, WORKING_DIR, readWdPackageJson } from './env.mjs'
import { overrideLocalMNLock, readLocalMNLock } from './MNLock.mjs'
import { SafePackageJson } from '../pkg-mng/types.mjs'

process.on('error', err => {
  console.error(err)
  err instanceof Error && console.error(err.stack)
  if (!IS_DEVELOPMENT) {
    return
  }
  process.exit()
})

await ensureInstallPackages()

const systemPkgInfo = await readWdPackageJson()

const imports = Object.entries(systemPkgInfo.dependencies ?? {}).map(
  async ([pkgName, pkgVersion]) => {
    const { pkgRootDir, packageJson } = await getPackageInfo({
      pkgId: { name: pkgName, version: pkgVersion },
    })
    console.log(`-- IMPORTING package ${pkgName}@${pkgVersion} --`)
    packageJson.exports
    const main = getMain(packageJson)
    return import(resolve(pkgRootDir, main)).then(() =>
      console.log(`-- IMPORTED package ${pkgName}@${pkgVersion} --`),
    )
  },
)

function getMain(pkgJ: SafePackageJson) {
  //TODO: should we support all pkgJ.exports ExportCondition s ?
  const pkgJexports = pkgJ.exports
  if (pkgJexports !== undefined && pkgJexports !== null) {
    if (typeof pkgJexports === 'string') {
      return pkgJexports
    } else if ('.' in pkgJexports) {
      const dotExports = (pkgJexports as any)['.']
      if (typeof dotExports !== 'string') {
        return _throw()
      }
      return dotExports
    }
  }
  return _throw()

  function _throw(): never {
    throw new Error(
      `package.json currently supports only "exports": string and "exports": { "." : string }`,
    )
  }
}
await Promise.all(imports)

console.log('\n------- ALL PACKAGES IMPORTED -------\n')

process.send?.('ready')

async function ensureInstallPackages() {
  if ((await readLocalMNLock()).installed) {
    return
  }

  console.log('installing system packages ...')
  await execa('npm', ['install', '-y', '--registry', NPM_REGISTRY], {
    cwd: WORKING_DIR,
    stdout: process.stdout,
  })
  await overrideLocalMNLock({ installed: true })
}
