/// <reference path="../moodlenet-react-app-lib.d.ts" />
import type { AuthenticationManagerExt } from '@moodlenet/authentication-manager'
import type { CoreExt, Ext, ExtDef } from '@moodlenet/core'
import type { MNHttpServerExt } from '@moodlenet/http-server'
import { mkdir, writeFile } from 'fs/promises'
import { tmpdir } from 'os'
import { resolve } from 'path'
import { ResolveOptions } from 'webpack'
import { generateCtxProvidersModule } from './generateCtxProvidersModule'
import { generateExposedModule } from './generateExposedModule'
import { generateRoutesModule } from './generateRoutesModule'
import { ExtPluginDef, ExtPluginsMap } from './types'
import { fixModuleLocForWebpackByOS } from './util'
import startWebpack from './webpackWatch'

export * from './types'
// const wpcfg = require('../webpack.config')
// const config: Configuration = wpcfg({}, { mode: 'development' })
const buildFolder = resolve(__dirname, '..', 'build')
const latestBuildFolder = resolve(__dirname, '..', 'latest-build')

export type ReactAppExt = ExtDef<
  'moodlenet.react-app',
  '0.1.10',
  {},
  null,
  {
    setup(_: ExtPluginDef): void
  }
>
const tmpDir = resolve(tmpdir(), 'MN-react-app-modules')

const LibModuleFile = { alias: 'moodlenet-react-app-lib', target: resolve(tmpDir, 'lib.ts') }
const ExtRoutesModuleFile = {
  alias: 'ext-routes',
  target: resolve(tmpDir, 'ext-routes.ts'),
}
const ExposeModuleFile = {
  alias: 'ext-exposed-modules',
  target: resolve(tmpDir, 'exposedExtModules.ts'),
}
const ExtContextProvidersModuleFile = {
  alias: 'ext-context-providers-modules',
  target: resolve(tmpDir, 'extContextProvidersModules.tsx'),
}
const ext: Ext<ReactAppExt, [CoreExt, MNHttpServerExt, AuthenticationManagerExt]> = {
  id: 'moodlenet.react-app@0.1.10',
  displayName: 'webapp',
  requires: ['moodlenet-core@0.1.10', 'moodlenet-http-server@0.1.10', 'moodlenet-authentication-manager@0.1.10'],
  enable(shell) {
    return {
      async deploy(/* { tearDown } */) {
        shell.onExtInstance<MNHttpServerExt>('moodlenet-http-server@0.1.10', (inst /* , depl */) => {
          const { express, mount } = inst
          const mountApp = express()
          const staticWebApp = express.static(latestBuildFolder, { index: 'index.html' })
          mountApp.use(staticWebApp)
          mountApp.get(`*`, (req, res, next) => {
            if (req.url.startsWith('/_/')) {
              next()
              return
            }
            res.sendFile(resolve(latestBuildFolder, 'index.html'))
          })
          mount({ mountApp, absMountPath: '/' })
        })
        await mkdir(tmpDir, { recursive: true })
        await mkdir(buildFolder, { recursive: true })
        const extPluginsMap: ExtPluginsMap = {}
        await writeAliasModules()
        const baseResolveAlias: ResolveOptions['alias'] = {
          'rxjs': resolve(__dirname, '..', 'node_modules', 'rxjs'),
          'react': resolve(__dirname, '..', 'node_modules', 'react'),
          'react-router-dom': resolve(__dirname, '..', 'node_modules', 'react-router-dom'),
          [ExtRoutesModuleFile.alias]: ExtRoutesModuleFile.target,
          [ExposeModuleFile.alias]: ExposeModuleFile.target,
          [ExtContextProvidersModuleFile.alias]: ExtContextProvidersModuleFile.target,
          [LibModuleFile.alias]: LibModuleFile.target,
        }
        console.log({ baseResolveAlias })

        const wp = await startWebpack({ buildFolder, latestBuildFolder, baseResolveAlias })
        return {
          inst({ depl }) {
            return {
              setup(plugin) {
                console.log('...setup', depl.extId, plugin)
                extPluginsMap[depl.extId] = {
                  ...plugin,
                  extName: depl.extName,
                  extVersion: depl.extVersion,
                  extId: depl.extId,
                }
                // console.log({ '***': wp.compiler.options.resolve.alias })
                if (plugin.addPackageAlias) {
                  const { loc, name } = plugin.addPackageAlias
                  wp.compiler.options.resolve.alias = {
                    ...baseResolveAlias,
                    [name]: loc,
                  }
                }
                writeAliasModules().then(() => {
                  // wp.compiler.compile(() => console.log('RE COMPILED'))
                  wp.compiler.watching.invalidate(() => console.log('INVALIDATED'))
                  // wp.compiler.watching.compiler.compile(() => console.log('RE COMPILED'))
                })
                console.log({ aloiases: wp.compiler.options.resolve.alias })
              },
            }
          },
        }
        function writeAliasModules() {
          console.log('writeAliasModules!', extPluginsMap)
          return Promise.all([
            writeFile(ExtRoutesModuleFile.target, generateRoutesModule({ extPluginsMap })),
            writeFile(ExposeModuleFile.target, generateExposedModule({ extPluginsMap })),
            writeFile(ExtContextProvidersModuleFile.target, generateCtxProvidersModule({ extPluginsMap })),
            writeFile(
              LibModuleFile.target,
              `
            import lib from '${fixModuleLocForWebpackByOS(resolve(__dirname, '..', 'src', 'react-app-lib'))}'
            export default lib
          `,
            ),
          ]) /* .then(() => {
            console.log(
              readFileSync(ExtRoutesModuleFile.target, 'utf-8'),
              readFileSync(ExposeModuleFile.target, 'utf-8'),
              readFileSync(ExtContextProvidersModuleFile.target, 'utf-8'),
              readFileSync(LibModuleFile.target, 'utf-8'),
            )
          }) */
        }
      },
    }
  },
}

export default { exts: [ext] }
